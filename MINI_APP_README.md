# Pulley Mini App

This is the mini app version of Pulley, an AI-powered trading platform built on the Bitcoin Core Network. The mini app is designed to work seamlessly within Base App and other Farcaster clients.

## Features

- **Mini App Integration**: Built with MiniKit for seamless Base App integration
- **Wallet Connection**: Connect your wallet using Particle Network
- **Trading Interface**: Simple trading interface for cryptocurrencies
- **Interactive Game**: Simple scoring system to demonstrate mini app functionality
- **Notifications**: Send notifications to users who save your frame
- **Social Sharing**: Share scores and achievements on Farcaster
- **Profile Viewing**: View Farcaster profiles directly from the app

## Mini App Specific Features

### MiniKit Hooks Used

- `useMiniKit`: Core mini app functionality and frame management
- `useAddFrame`: Save the mini app to user's frame list
- `useNotification`: Send notifications to users
- `useComposeCast`: Share content on Farcaster
- `useViewProfile`: View Farcaster profiles
- `useClose`: Close the mini app
- `usePrimaryButton`: Global action button for tab switching
- `useOpenUrl`: Safely open external URLs

### Frame Management

- Users can save your mini app to their frame list
- Once saved, you can send them notifications
- Webhook support for tracking frame events

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @coinbase/onchainkit @farcaster/frame-wagmi-connector
```

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Your existing variables
NEXT_PUBLIC_PARTICLE_PROJECT_ID=your_particle_project_id
NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your_particle_client_key

# Mini App specific variables (update these with your actual values)
NEXT_PUBLIC_URL=https://your-domain.com
NEXT_PUBLIC_IMAGE_URL=https://your-domain.com/favicon.ico
NEXT_PUBLIC_SPLASH_IMAGE_URL=https://your-domain.com/favicon.ico
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0a0f1a

# Farcaster Account Association (generate these using the manifest tool)
FARCASTER_HEADER=your_generated_header
FARCASTER_PAYLOAD=your_generated_payload
FARCASTER_SIGNATURE=your_generated_signature
```

### 3. Update Farcaster Manifest

The manifest file is located at `public/.well-known/farcaster.json`. You'll need to:

1. Generate your own account association using the Farcaster manifest tool
2. Update the URLs to match your deployed domain
3. Update the account association header, payload, and signature

### 4. Deploy

Deploy your app to a hosting provider like Vercel:

```bash
npm run build
vercel --prod
```

### 5. Test in Farcaster

1. Visit the [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Enter your deployed domain
3. Test the mini app functionality

## File Structure

```
src/
├── app/
│   ├── mini-app/
│   │   └── page.tsx          # Mini app main page
│   ├── api/
│   │   ├── webhook/
│   │   │   └── route.ts      # Webhook handler
│   │   └── notification/
│   │       └── route.ts      # Notification proxy
│   ├── providers.tsx         # MiniKit provider wrapper
│   ├── layout.tsx            # Updated layout with providers
│   └── page.tsx              # Main landing page
├── components/
│   ├── simpleTrading.tsx     # Simple trading interface
│   └── ...                   # Other existing components
└── lib/                      # Utility functions
public/
└── .well-known/
    └── farcaster.json        # Farcaster manifest
```

## Mini App Routes

- `/mini-app`: The main mini app interface
- `/api/webhook`: Handles mini app webhook events
- `/api/notification`: Proxy for sending notifications

## Mini App Interface

The mini app features two main tabs:

### Trading Tab
- **Trading Pair Selection**: Choose between BTC/USD, ETH/USD, and SOL/USD
- **Price Display**: Real-time price information with 24h change
- **Order Types**: Buy and sell functionality
- **Amount Input**: Enter trade amounts in USD
- **Trade Execution**: Simulated trading with loading states

### Game Tab
- **Score System**: Interactive scoring with +10/-5 point buttons
- **Frame Management**: Save frame and send notifications
- **Social Features**: Share scores on Farcaster
- **Profile Viewing**: View Farcaster profiles

## Customization

### Adding New Mini App Features

1. **New Hooks**: Import additional MiniKit hooks as needed
2. **Custom Actions**: Add new buttons and functionality
3. **State Management**: Extend the existing state management
4. **Styling**: Modify the existing color scheme and components

### Integrating with Existing Features

The mini app is designed to work alongside your existing trading platform. You can:

- Add real trading functionality to the mini app
- Integrate with your existing portfolio system
- Add market data and charts
- Include your AI prediction tools

## Troubleshooting

### Common Issues

1. **Frame not loading**: Check the Farcaster manifest configuration
2. **Notifications not working**: Verify the notification proxy is working
3. **Wallet connection issues**: Check Particle Network configuration
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Module Resolution Issues

If you encounter uuid module resolution errors:

1. **Check Next.js config**: Ensure webpack configuration is properly set
2. **Dependency conflicts**: Remove conflicting packages like `@1inch/limit-order-sdk`
3. **Clean install**: Run `rm -rf node_modules && npm install`
4. **Build cache**: Clear Next.js build cache with `npm run build -- --no-cache`

### Debug Mode

Enable debug logging by checking the browser console for MiniKit messages.

## Testing

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000/mini-app` to test the mini app locally.

### Frame Testing

Use the Farcaster dev tools or ngrok to test frame functionality:

```bash
npx ngrok http 3000
```

### Webhook Testing

Test webhooks using tools like ngrok or by deploying to a live environment.

## Next Steps

1. **Deploy to production**: Get your mini app live on a real domain
2. **Add real trading features**: Integrate your existing trading logic
3. **Implement notifications**: Set up proper notification infrastructure
4. **Add analytics**: Track mini app usage and engagement
5. **Optimize for mobile**: Ensure the best experience on mobile devices

## Resources

- [MiniKit Documentation](https://docs.base.org/base-app/build-with-minikit/overview)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Base App Documentation](https://docs.base.org/base-app/)
- [OnchainKit](https://onchainkit.xyz/)

## Support

For issues related to:
- **MiniKit**: Check the Base documentation
- **Farcaster**: Visit the Farcaster Discord
- **Your app**: Check your existing support channels

---

Built with ❤️ using MiniKit and Base
