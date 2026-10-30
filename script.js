const stakeholders = [
{
    avatar:"👩‍💼",
    name:"Emma Carter",
    role:"Helpdesk Manager",
    statement:"Over 50 employees have reported account lockouts this morning.",
    questions:[
        "When did the reports begin?",
        "Which departments are affected?",
        "What issues are users reporting?"
    ]
},
{
    avatar:"👨‍💻",
    name:"Daniel Hughes",
    role:"SOC Analyst",
    statement:"Large outbound traffic was detected at 03:12 AM.",
    questions:[
        "What data may have left the network?",
        "What systems generated alerts?",
        "Should the incident be escalated?"
    ]
},
{
    avatar:"💼",
    name:"Sophie Mitchell",
    role:"Chief Financial Officer",
    statement:"A payment of £48,000 was approved overnight.",
    questions:[
        "Who approved the payment?",
        "Was MFA enabled?",
        "Could systems be compromised?"
    ]
},
{
    avatar:"📋",
    name:"James Walker",
    role:"HR Manager",
    statement:"An employee clicked an email attachment pretending to be IT Support.",
    questions:[
        "Who received the email?",
        "What did the attachment contain?",
        "Could credentials be stolen?"
    ]
},
{
    avatar:"🏢",
    name:"Olivia Bennett",
    role:"CEO",
    statement:"Customers are already asking questions on social media.",
    questions:[
        "What is the business impact?",
        "What should be communicated?",
        "What should happen next?"
    ]
}
];

let currentStakeholder = 0;

function startInvestigation(){
    displayStakeholder();
}

function displayStakeholder(){

    if(currentStakeholder >= stakeholders.length){

        document.getElementById("content").innerHTML = `
        <div class="card">
            <h2>✅ Investigation Complete</h2>

            <div class="question">
                What was the root cause of the incident?
            </div>

            <div class="question">
                How did the attacker gain access?
            </div>

            <div class="question">
                What evidence supports your conclusion?
            </div>

            <div class="question">
                What should the company do next?
            </div>

            <textarea placeholder="Write your final incident report here"></textarea>
        </div>
        `;

        return;
    }

    const person = stakeholders[currentStakeholder];

    let html = `
    <div class="progress">
        Stakeholder ${currentStakeholder + 1} of ${stakeholders.length}
    </div>

    <div class="card">

        <div class="avatar">
            ${person.avatar}
        </div>

        <h2>${person.name}</h2>

        <h3>${person.role}</h3>

        <p>${person.statement}</p>

        <h3>Questions for Your Team</h3>
    `;

    person.questions.forEach(question => {
        html += `
        <div class="question">
            ${question}
        </div>
        `;
    });

    html += `
        <button onclick="nextStakeholder()">
            Interview Next Stakeholder
        </button>

    </div>
    `;

    document.getElementById("content").innerHTML = html;
}

function nextStakeholder(){
    currentStakeholder++;
    displayStakeholder();
}