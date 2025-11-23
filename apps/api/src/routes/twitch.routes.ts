import { Router, Request, Response } from 'express';
import type { IRouter } from 'express';

const router: IRouter = Router();

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TwitchUserResponse {
  data: Array<{
    id: string;
    login: string;
    display_name: string;
    profile_image_url: string;
    email?: string;
  }>;
}

/**
 * GET /api/twitch/callback
 * 
 * Callback OAuth Twitch - Appelé après autorisation utilisateur
 * 
 * Flow:
 * 1. Twitch redirige ici avec un code d'autorisation
 * 2. On échange ce code contre un access token (avec Client Secret)
 * 3. On récupère les infos utilisateur depuis l'API Twitch
 * 4. On redirige vers le frontend avec les données utilisateur
 */
router.get('/callback', async (req: Request, res: Response) => {
  const { code, error, error_description } = req.query;

  // Vérifier si l'utilisateur a refusé
  if (error) {
    console.error('[Twitch OAuth] Authorization denied:', error_description);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/twitch/callback?error=${error}&error_description=${error_description}`
    );
  }

  // Vérifier le code
  if (!code || typeof code !== 'string') {
    console.error('[Twitch OAuth] No authorization code received');
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/twitch/callback?error=no_code&error_description=No authorization code received`
    );
  }

  try {
    // Étape 1: Échanger le code contre un access token
    console.log('[Twitch OAuth] Exchanging code for access token...');
    
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TWITCH_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('[Twitch OAuth] Token exchange failed:', errorData);
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json() as TwitchTokenResponse;
    console.log('[Twitch OAuth] Access token obtained');

    // Étape 2: Récupérer les infos utilisateur
    console.log('[Twitch OAuth] Fetching user info...');
    
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('[Twitch OAuth] User fetch failed:', errorData);
      throw new Error(`User fetch failed: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json() as TwitchUserResponse;
    
    if (!userData.data || userData.data.length === 0) {
      throw new Error('No user data returned from Twitch');
    }

    const user = userData.data[0];
    console.log('[Twitch OAuth] User authenticated:', user.login);

    // Étape 3: Rediriger vers le frontend avec les données
    const frontendCallbackUrl = new URL(`${process.env.FRONTEND_URL}/auth/twitch/callback`);
    frontendCallbackUrl.searchParams.set('username', user.login);
    frontendCallbackUrl.searchParams.set('userId', user.id);
    frontendCallbackUrl.searchParams.set('displayName', user.display_name);
    frontendCallbackUrl.searchParams.set('avatarUrl', user.profile_image_url);
    
    if (user.email) {
      frontendCallbackUrl.searchParams.set('email', user.email);
    }

    console.log('[Twitch OAuth] Redirecting to frontend');
    return res.redirect(frontendCallbackUrl.toString());

  } catch (error) {
    console.error('[Twitch OAuth] Error:', error);
    
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/twitch/callback?error=server_error&error_description=${encodeURIComponent(
        error instanceof Error ? error.message : 'Unknown error'
      )}`
    );
  }
});

/**
 * GET /api/twitch/status
 * Health check
 */
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Twitch OAuth API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
