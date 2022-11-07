module.exports = [
  {
    "source": "/api/:path*",
    "destination": "https://explorer-test-main.aelf.io/api/:path*"
  },
  {
    "source": "/cms/:path*",
    "destination": "https://explorer-test-main.aelf.io/cms/:path*"
  },
  {
    "source": "/socket",
    "destination": "https://explorer-test-main.aelf.io/socket"
  },
  {
    "source": "/new-socket",
    "destination": "https://explorer-test-main.aelf.io/new-socket"
  },
  {
    "source": "/chain/:path*",
    "destination": "https://explorer-test-main.aelf.io/chain/:path*"
  },
  {
    "source": "/api/blockChain/:path*",
    "destination": "https://explorer-test-main.aelf.io/chain/api/blockChain/:path*"
  }
]
