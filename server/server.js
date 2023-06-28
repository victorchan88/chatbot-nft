const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let chatBotState = {
    fields: ["Certificate data", "Certificate type", "Tracking system ID", "Renewable fuel type", "Renewable facility location", "Nameplate capacity of project", "Project name", "Project vintage (build date)", "Certificate (generation) vintage", "Certificate unique identification number", "Utility to which project is interconnected", "Eligibility for certification or renewable portfolio standard (RPS)", "Emissions rate of the renewable resource"],
    position: 0,
    data: {}
};

app.get('/start', async (req, res) => {
    res.json({ question: "Please enter " + chatBotState.fields[0] });
});

app.post('/chat', async (req, res) => {
    let answer = req.body.answer;

    let field = chatBotState.fields[chatBotState.position];
    chatBotState.data[field] = answer;

    chatBotState.position++;

    if (chatBotState.position >= chatBotState.fields.length) {
        // Here you could handle the minting process of the NFT
        // ...

        // Send the chatBotState.data before resetting
        const responseData = chatBotState.data;

        // Reset state
        chatBotState.position = 0;
        chatBotState.data = {};

        res.json({ data: responseData, message: "Your NFT has been minted. You can create another one." });
        return;
    }


    let nextField = chatBotState.fields[chatBotState.position];

    res.json({ question: "Please enter " + nextField });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080...');
});
