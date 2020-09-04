# Leetcode-discord-bot
Discord bot that posts a random [leetcode](https://leetcode.com/) question based on custom commands.

> NOTE: I have an AWS free tier, and have a limit warning in place for the EC2 instance this bot is hosted on. Depending on monthly usage, the service will go down so I don't incur charges for the month. You can check if it's up [here](https://discord.bots.gg/bots/730413116172796007) (if the status symbol is green, it's up!). Sorry, in advance!

### Installation and running locally

1. Clone this project to your system using 
```bash
git clone https://github.com/chakrakan/leetcode-disc.git
```

2. `cd leetcode-disc` to switch directory to the bot's directory
3. `npm i` or `npm install` to get all its dependencies
4. Create a `.env` file at the root of the project folder
```bash
touch .env
```
Add a variable `DISCORD_BOT_TOKEN=` and leave it empty for now.  

5. Now make sure to create a `New Application` on Discord from their [portal](https://discord.com/developers/applications/)
    - once created, visit its `Bot` tab and grab the `token` and paste it as the value for `DISCORD_BOT_TOKEN`
6. Run the bot using `npm start` and you should be able to use the commands once you invite your own app to a server of your choice.


### Usage

##### Regular Commands

`!problem (without args) - gives you a random problem of any difficulty either paid/free.`   
`!problem info - gives you an overview of problems and your progress` (WIP)  
`!problem free - gives you a random freely accessible problem of any difficulty.`  
`!problem paid - gives you a random paid/locked problem of any difficulty.`  

#### Adding difficulty modifiers:

`!problem <free | paid> <easy | medium | hard> - lets you pick a random free or paid problem of the chosen difficulty.`

### Sample

![](https://github.com/chakrakan/leetcode-disc/blob/master/demo/demo.gif)


### ToDo

- add more feature for per user experience See [#1](https://github.com/chakrakan/leetcode-disc/issues/1#issue-656379593) 
