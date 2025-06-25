# <img src="./build/icon.png" alt="icon" height="30" width="30" style="margin-bottom: -5px" /> Gif Compiler

A simple Electron + React + Magick++ app to speed up creation of GIFs
> This was, for the most part, created as a favour for a friend to speed up their day-to-day workflow in a design agency

## Examples

You can download the examples folder to try locally: [examples.zip](./examples/examples.zip)

Check out example results at: [./examples/results](./examples/results)

![featured](.github/docs/featured.png)

## Directory structure
```sh
# -> Input folder
│
├── name_100x100_assets
│   │
│   ├── 1.jpg
│   └── 2.jpg
│
└── name_200x200_assets
    │
    ├── EN
    │   │
    │   ├── C01
    │   │   ├── 1.jpg
    │   │   └── 2.jpg
    │   │
    │   └── C02
    │       ├── 1.jpg
    │       └── 2.jpg
    │
    └── DE
        ├── C01
        │   ├── 1.jpg
        │   └── 2.jpg
        │
        └── C02
            ├── 1.jpg
            └── 2.jpg
```

## Development

No ENV variables required, just install node deps and run!

For working with the C++ code see [./scripts/README.md](./scripts/README.md)
