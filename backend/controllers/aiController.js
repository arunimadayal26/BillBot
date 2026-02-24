const { GoogleGenAI } = require("@google/genai");
const mongoose = require('mongoose'); 
const Invoice = require("../models/Invoice");


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

//// PARSE INVOICE FROM TEXT
const parseInvoiceFromText = async(req, res)=> {
    const { text } = req.body;

    if(!text) {
        return res.status(400).json({message: "Text is required"});
    }

    try{
       //Creating a prompt for AI
        const prompt = `You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.
        The Output must be a valid JSON object,
        
        The JSON object should have the following structure:
        {
        "clientName: "string",
        "email": "string (if available"),
        "items": [
        {
        "name":"string",
        "quantity":"number",
        "unitPrice":"number"
        }
    ]
    }
    
    Here is the text to parse:
    ---TEXT START---
    ${text}
    ---TEXT END---

    Extract the data and provide only the JSON object.`;
    
    //Calling the AI
    const response  = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
    });
   
    //Extracting the text from AI response
    const responseText = response.text;

    if(typeof responseText !== 'string') {
        if(typeof response.text === 'function') {
            responseText = response.text();
        } else{
            throw new Error('Could not extract text from AI response.');
        }
    }
   
    //Cleaning the AI output
    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    //Parsing JSON
    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);

    } catch(error){
        console.log("Error parsing invoice with AI", error);
        res.status(500).json({message: "Failed to parse invoice data from text", details:error.message});

    }
};

//GENERATE REMINDER EMAIL
const generateReminderEmail = async(req, res)=> {
    const invoiceId = req.body.invoiceId?.trim();

    if (!invoiceId) {
        return res.status(400).json({ message: "Invoice ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        console.log("🔹 Invoice fetched:", invoice);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const prompt = `
You are a professional and polite accounting assistant. Write a friendly reminder email to a client about an overdue or upcoming invoice payment.

- Client Name: ${invoice.billTo.clientName}
- Invoice Number: ${invoice.invoiceNumber}
- Amount Due: ${invoice.total.toFixed(2)}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Tone: friendly but clear, concise. Start email with "Subject:".
        `;

        console.log("Prompt:", prompt);

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        console.log("AI response:", response);

        const reminderText = response.text || response.output_text || "No text returned";

        res.status(200).json({ reminderText });

    } catch (error) {
        console.error("Error generating reminder:", error);
        res.status(500).json({ message: "Failed to generate reminder", details: error.message });
    }
};



// DASHBOARD SUMMARY
const getDashboardSummary = async(req, res)=> {
    try{
        const invoices = await Invoice.find({user: req.user.id});

        if(invoices.length===0) {
            return res.status(200).json({ insights: ["No invoice data available to generate insights."]});
        }

        //Process and summarize data
        const totalInvoice = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status=== 'Paid');
        const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
        const totalRevenue = paidInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
        const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);

        const dataSummary = `
        -Total number of invoices: ${totalInvoice}
        -Total paid invoices: ${paidInvoices.length}
        -Total unpaid/pending invoices: ${unpaidInvoices.length}
        -Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
        -Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
        -Recent invoices (last 5): ${invoices.slice(0, 5).map(inv => `Invoice #${inv.invoiceNumber} for #${inv.total.toFixed(2)} with status ${inv.status}`).join(',')}`;

        const prompt = `
        You are a friendly and insightful financial analyst for a small business owner.
        Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
        Each insights should be a short string in a JSON array.
        The insights should be encouraging and helpful. Do not just repeat the data.
        For example, if there is a high outstanding amount, suggest sending reminders. If revenue is high, be encouraging.

        Data Summary:
        ${dataSummary}

        Return your responses as a valid JSON object with a single key "insights" which is an array of strings.
        Example format: { "insights": ["Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminders to get paid faster."]}`;

        const response = await ai.models.generateContent({
            model:"gemini-flash-latest",
            contents: prompt,
        });

        const responseText = response.text;
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData);

    } catch(error){
        console.log("Error dashboard summary with AI", error);
        res.status(500).json({message: "Failed dashboard summary", details:error.message});

    }

};

module.exports = { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };