# Welcome to Mausritter Colony 👋
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![License Mausritter Third Party Licence](https://img.shields.io/badge/License-Mausritter%20Third%20Party%20Licence-yellow.svg)](https://mausritter.com/third-party-licence/)

> Mausritter Colony offers a very simple tool to manage your Mausritter game.You can count turns, see a summary of your players' mice and track dice rolls. Mausritter Colony is not intended to replace a Virtual Game Table.

**ALPHA VERSION**. It's a work in progress that's not ready to for daily use. — Stay tune ;-)

### 🏠 [Homepage](https://mausritter-colony.dco.ninja)

![Mausritter-Colony](./mausritter-colony-01.jpg)

## Install

The front-end and back-end are separate packages, each with its own `package.json`
and `node_modules`. There is no package management at the repository root.

```sh
cd frontend && npm install   # Vue app, served on http://localhost:8802 (npm run serve)
cd server && npm install     # Express API, served on http://127.0.0.1:3000 (npm start)
```

When deploying to Vercel, create one project per package and set its **Root Directory**
to `frontend` or `server` respectively.

## Author

👤 **Daniel Coquette**

* Github: [@yar0d](https://github.com/yar0d)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/yar0d/mausritter-colony/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2021 [Daniel Coquette](https://github.com/yar0d).

This project is [Mausritter Third Party Licence](https://mausritter.com/third-party-licence/) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
