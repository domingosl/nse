# NSE
### NEAR SMART EVENTS

**An entry for the METABUILD III Hackathon**

With ❤ From Milan 🍕, By Eng. Domingo Lupo

## What it is?
No-code solution to listen and process on-chain events. It's an Integration Platform As A Service that can be embedded into Pagoda Console or run stand-alone.

**READ MORE AT: [https://devpost.com/software/near-smart-events](https://devpost.com/software/near-smart-events)**

- Marketing presentation: [https://youtu.be/0O109mMgp4Y](https://youtu.be/0O109mMgp4Y)
- Technical presentation: [https://youtu.be/IQ76AY2issw](https://youtu.be/IQ76AY2issw)


## Tech Stack
- NodeJS
- ExpressJS
- MongoDB
- Agenda (Queue Worker)
- litegraph.js (Graphic engine, heavily modified to work with NEAR ecosystem)
- **NEAR JS SDK**
- Docker

### Website (Private Alpha)
[https://nearsmart.events](https://nearsmart.events)

You can use a demo account:

**user**: near@test.com

**password**: Pagoda1.

Or you can create a new account using the **invitation code**: **nse0001**


## Run it locally

- Pull the repo
- npm i
- npm run buildApp
- npm run buildSite
- node worker
- node index

You'll need to prepare a .env file with a few credentials. 
Take a look on the .env.example file
to know what is necessary.