const stakeholders = [

{
    avatar:"👩‍💼",
    name:"Emma Carter",
    role:"Helpdesk Manager",

    statement:
    "Over 50 employees have reported account lockouts this morning. Several users also received password reset notifications that they did not request.",

    questions:[
        "When did the reports begin?",
        "Which departments are affected?",
        "What type of account issues are users reporting?"
    ]
},

{
    avatar:"👨‍💻",
    name:"Daniel Hughes",
    role:"SOC Analyst",

    statement:
    "Our monitoring systems detected large outbound data transfers to an unknown IP address at 03:12 AM. The activity originated from an internal workstation.",

    questions:[
        "What data may have left the network?",
        "What systems generated the alerts?",
        "Should the incident be escalated immediately?"
    ]
},

{
    avatar:"💼",
    name:"Sophie Mitchell",
    role:"Chief Financial Officer",

    statement:
    "A payment of £48,000 was approved outside normal working hours. Nobody in Finance recognises the transaction.",

    questions:[
        "Who approved the payment?",
        "Was multi-factor authentication used?",
        "Could financial systems be compromised?"
    ]
},

{
    avatar:"📋",
    name:"James Walker",
    role:"HR Manager",

    statement:
    "One employee admitted opening an email attachment that appeared to come from IT Support. Several other employees received the same message.",

    questions:[
        "What did the email contain?",
        "Who received the message?",
        "Could credentials have been stolen?"
    ]
},

{
    avatar:"🏢",
    name:"Olivia Bennett",
    role:"Chief Executive Officer",

    statement:
    "Customers are already asking questions on social media. The Board expects an incident briefing within the next 15 minutes.",

    questions:[
        "What is the business impact?",
        "What should be communicated externally?",
        "What actions should be taken immediately?"
    ]
}

];

let currentStakeholder = 0;
let investigationNotes = [];

// Start Investigation
function startInvestigation() {
    document.querySelector("button").style.display = "none";
    displayStakeholder();
}

// Display Current Stakeholder
function displayStakeholder() {

    if (currentStakeholder >= stakeholders.length) {
        showFinalReport();
        return;
    }

    const person = stakeholders[currentStakeholder];

    let questionsHTML = "";

    person.questions.forEach(question => {
        questionsHTML += `
            <div class="question">
                ${question}
            </div>
        `;
    });

    document.getElementById("content").innerHTML = `

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

            ${questionsHTML}

            <h3>Investigation Notes</h3>

            <textarea
                id="notes"
                placeholder="Record important findings, evidence and observations here..."
            ></textarea>

            <button onclick="saveNotesAndContinue()">
                Interview Next Stakeholder
            </button>

        </div>
    `;
}

// Save Notes
function saveNotesAndContinue() {

    const notes = document.getElementById("notes").value;

    investigationNotes.push({
        stakeholder: stakeholders[currentStakeholder].name,
        notes: notes
    });

    currentStakeholder++;

    displayStakeholder();
}

// Final Report Screen
function showFinalReport() {

    let notesHTML = "";

    investigationNotes.forEach(item => {

        notesHTML += `
            <div class="card">
                <h3>${item.stakeholder}</h3>
                <p>${item.notes || "No notes recorded."}</p>
            </div>
        `;
    });

    document.getElementById("content").innerHTML = `

        <div class="card">

            <h1>✅ Investigation Complete</h1>

            <h2>Cyber Incident Review</h2>

            <p>
                Your team has interviewed all stakeholders.
            </p>

            <h3>Final Discussion Questions</h3>

            <div class="question">
                What was the most likely root cause of the attack?
            </div>

            <div class="question">
                How did the attacker gain access?
            </div>

            <div class="question">
                Which evidence was most significant?
            </div>

            <div class="question">
                What was the business impact?
            </div>

            <div class="question">
                What should NexusSphere do next?
            </div>

            <h3>Final Incident Summary</h3>

            <textarea
                id="finalReport"
                placeholder="Write your final incident report here..."
            ></textarea>

        </div>

        <h2>Your Investigation Notes</h2>

        ${notesHTML}
    `;
}