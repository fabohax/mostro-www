# Mostro Web Client

Web client for the [Mostro](https://github.com/MostroP2P/mostro) P2P system, built with Next.js.  
This client provides a browser interface for peer-to-peer Bitcoin trading over the Lightning Network using Nostr.

## Overview

- Built with [Next.js](https://nextjs.org/)
- Enables decentralized trading via the Lightning Network
- Uses Nostr for communication and identity (NIP-07 and mnemonic-based)
- Communicates with a running Mostro daemon

## Requirements

### Node.js and npm

- Node.js: `v20.15.1` (recommended)
- npm: `10.7.0` (recommended)

### Mostro Daemon

This client requires a running instance of the [Mostro daemon](https://github.com/MostroP2P/mostro).  
Follow the instructions in the [Mostro README](https://github.com/MostroP2P/mostro#requirements) to set it up.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/fabohax/mostro-www.git
cd mostro-www
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Set the following variables:

```env
NEXT_PUBLIC_RELAY_URL=wss://relay.mostro.network,wss://relay.nostr.net
NEXT_PUBLIC_MOSTRO_PUBKEY=npub19m9laul6k463czdacwx5ta4ap43nlf3lr0p99mqugnz8mdz7wtvskkm5wg
```

Load environment variables:

```bash
source .env
```

Optional: You can run your own relay using Docker. See [this section](https://github.com/MostroP2P/mostro#option-1-run-mostro-with-a-private-dockerized-relay) in the Mostro repository.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Roadmap

#### Order Flow

- [ ] **Integrate Gift Wrap support `kind: 38383`**
  - Proper serialization and payload signing  
  - Use `["d", uuid]` tag as unique identifier  

- [ ] **`/order/[id]` page**
  - Listen for events using `#d` filter  
  - Display parsed order data + metadata (`pubkey`, `sig`, `created_at`)  
  - Show raw JSON for debugging  

- [ ] **Global orders list `/orders`**
  - Fetch the latest 20 orders (`kind: 23196`)  
  - Filters: type (Buy/Sell), currency, payment method  
  - Quick actions: view or take order  

- [ ] **User order history `/u/[npub]`**
  - List orders created by the current user  
  - Access details and contextual interactions  

- [ ] **UX improvements / validations**
  - Validate form inputs before publishing  
  - Add loaders, toasts, and clear messages  
  - Fallback handling for network or signing errors  

### Features 

- Order creation: Buy and Sell  
- Market and fixed price modes  
- Taker and Maker flows  
- Multiple relay support  
- NIP-07 and mnemonic-based key management  
- Message decoding and peer chat  
- Dispute handling  
- Persistent event loading  
- Chat history and messaging  
- Order history and details and filtering  
- Order cancellation and dispute resolution

## Scripts

These are common Next.js scripts available:

```bash
# Run in development mode
npm run dev

# Create production build
npm run build

# Start production server
npm run start
```

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Create a Pull Request describing your changes

Please make sure your code follows the existing style and passes linting before submitting a PR.

## License

This project is licensed under the MIT License. See the `LICENSE` file for full details.

