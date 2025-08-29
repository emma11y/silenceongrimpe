{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist/silenceongrimpe/browser",
  "functions": {
    "api/index.mjs": {
      "runtime": "@vercel/node@3.0.0"
    }
  },
  "rewrites": [
    {
      "source": "/assets/(.*)",
      "destination": "/assets/$1"
    },
    {
      "source": "/(.*\\.(?:js|css|ico|png|webp))",
      "destination": "/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/api/index.mjs"
    }
  ]
}