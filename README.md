# DiscordJS_Bot

  Node.js bot written by a student practicing Computer Science concepts to learn about Bungie
  and Discords API usage. This bot provides the functionality of raid.report without needing a web browser open, providing detailed Destiny 2 Raid info for an account straight to the Discord channel.
  Many PC players keep Discord open while gaming, but keeping Chrome open will eat resources. This bot provides a lightweight solution while bringing along it's quirkiness with emote usage and joke commands.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Prerequisites

- Node.js (18.16.0)
- MongoDB (Just a single DB with a collection in the cloud, small scale project)
- Discord account, Discord bot token, Bungie API token, Database name, connection info
  collection info, and ID.

## Installation

1. git clone https://github.com/OscarIsaula/DiscordJS_Bot.git
2. cd into repo
3. Run 'npm install' to install dependencies
4. Provide [Configuration](#configuration) info in a .env file
5. Run 'node index.js'
6. Interact with bot via web browser or Discord App.

## Configuration

Provide the following in a file named '.env' in the project directory.
Replace "XXX" with the actual info

- TOKEN=XXX // Discord Bot Token
- KEY=XXX // Bungie API Token
- DB=XXX // Database Connection Info
- DB_NAME=XXX // Database Name
- COLLECTION_NAME=XXX // Name of Collection Within Database
- ID=XXX // Database UserID

## Usage

# Main Bot Commands

- '!help': relays all available commands to the Discord channel.
- '!day1': outputs detailed report to Discord channel regarding users Destiny 2 Day One raids.
- '!lowman': outputs reports to Discord channel regarding users Low Man raid history.
- '!joke': sends a random API called joke from https://v2.jokeapi.dev/joke/.
- '!quote': uses File IO to send a random quote from a curated list from 'quotes.txt'.

# Misc Bot Commands

- '!flip': flips a coin.
- '!roll(x)': rolls an x sided die.
- '!dj': displays the time remaining until DJ, who runs a tight and consistent schedule, gets online.
- '!was kap blackballed': returns 'no'.
- '+p': adds 1 to the respective database object, which is p's score against DJ.
- '+dj': adds 1 to the respective database object, which is DJ's score against p.