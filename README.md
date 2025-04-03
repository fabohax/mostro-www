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

Copy the sample config file and edit it:

```bash
cp .env-sample .env
```

Set the following variables:

- `RELAYS`: A comma-separated list of Nostr relay URLs.

```env
RELAYS=wss://relay.mostro.network,wss://relay.nostr.net
```

- `MOSTRO_PUB_KEY`: The public key (`npub`) of the Mostro daemon you're connecting to.

```env
MOSTRO_PUB_KEY=npub1examplekeyhere...
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

### Cronograma de Desarrollo

#### Flujo de Órdenes

- [ ] **Integrar soporte Gift Wrap `kind: 38383`**
  - Serialización correcta y firma del payload
  - Tag `["d", uuid]` como identificador único

- [ ] **Página `/order/[id]`**
  - Escucha por eventos con `#d`
  - Mostrar datos de la orden parseados + metadata (`pubkey`, `sig`, `created_at`)
  - Visualizar JSON crudo para debugging

- [ ] **Listado general `/orders`**
  - Fetch de las últimas 20 órdenes (`kind: 23196`)
  - Filtros: tipo (Buy/Sell), moneda, método de pago
  - Acciones rápidas: ver o tomar orden

- [ ] **Historial en perfil `/u/[npub]`**
  - Listado de órdenes creadas por el usuario
  - Acceso a detalles e interacción contextual

- [ ] **Mejoras UX / validaciones**
  - Validaciones de formulario antes de publicar
  - Loaders, toasts y mensajes claros
  - Fallback en caso de errores de red o firma

---

### ✅ Features 

- Order creation: Buy and Sell  
- Market and fixed price modes  
- Taker and Maker flows  
- Multiple relay support  
- NIP-07 and mnemonic-based key management  
- Message decoding and peer chat  
- Dispute handling  
- Persistent event loading  

---

### 🚧 En Progreso

- NIP-59 support (payment method metadata)

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

