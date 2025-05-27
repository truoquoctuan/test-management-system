# Getting Started

## Installation

Step 1: Setup node version 16.14.2 (LTS)

[Download](https://nodejs.org/en/blog/release/v16.14.2) or another version

```sh
node --version
```

nvm for windows (node version management) [view](https://github.com/coreybutler/nvm-windows#readme)

</br>

Step 2: Install packets

```sh
npm install
```

Step 3: Start

- Run the product in the environment (setup .env file)

  ```sh
  npm start
  ```

- Run the develop in the environment (setup .env.development.local file)

  ```sh
  npm run dev
  ```

  .env.development.local
  
  ```sh
    REACT_APP_API_URL=
  ```

</br>

## Build

```sh
npm run build
```

## More

### Eslint  

1. Configure LF (window)

    ```git
    git config --global core.autocrlf false
    git config --global core.eol lf
    ```

2. Setup ide

    Format on save eslint [view](https://www.aleksandrhovhannisyan.com/blog/format-code-on-save-vs-code-eslint/)

    .vscode/setting.json

    ```json
    {
      "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
      ],
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      }
    }
    ```

</br>

### [Documents](https://gitlab.bzcom.vn/bzcom-uda/uda-fe/-/wikis/home)
