import {Sparkles} from "lucide-react";
import {BarChart2} from "lucide-react";
import {Mail} from "lucide-react";
import {FileText} from "lucide-react";
import {LayoutDashboard} from "lucide-react";
import {Plus} from "lucide-react";
import {Users} from "lucide-react";



export const FEATURES = [
    {
        icon:Sparkles,
        title:"AI Invoice Creation",
        description:"Paste any texts, email, or receipt, and let our AI instantly generate a complete summary and reminders",
    },
    {
        icon:BarChart2,
        title:"AI-Powered Dashboard",
        description:"Get smart, actionable insights about your buisness finances",
    },
    {
        icon:Mail,
        title:"Smart Reminders",
        description:"Automatically generates polite and effective payment reminder emails for overdue invoice payement",

    },
    {
        icon:FileText,
        title:"Easy Invoice Management",
        description:"Easily manage all your invoices, track payments, and send reminder for overdue payments",
    }

];

export const TESTIMONIALS=[
    {
        quote:"This app saved me hours of work. I can create and send invoices in minutes!",
        author:"Anshika sharma",
        title:"Freelancer",
    },
    {
        quote:"Great app. Must give a try",
        author:"Ved Narayan",
        title:"Consultant",
    },
    {
        quote:" Time efficient.Life saver!",
        author:"Anushree Verma",
        title:"Small Buisness",
    },

];

export const FAQS=[
    {
        question:"How does the AI invoice creation work",
        answer:"Simply post any text that contains invoice details - like an email, a list of items, or a work summary - and our AI will instantly parse it to pre-fill a new inoice for you, saving your time and effort "
    },
    {
        question:"Can I edit an invoice after it's generated?",
        answer:"Yes, you can edit any invoice before downloading or sending it "
    },
    {
        question:"Can I download invoices as PDF?",
        answer:"Yes, you can download and share your invoices in PDF format instantly "
    },
    {
        question:"Can other info be added to an invoice?",
        answer:"Yes, you can customize invoices with notes, taxes, dicounts, and payement details"
    },
    {
        question:"How do I change my account email?",
        answer:"You can update your email anytime from your account profile"
    }
];

//Navigate items configuration
export const NAVIGATION_MENU= [
    {id: "dashboard", name:"Dashboard", icon:LayoutDashboard},
    {id: "invoices", name:"Invoices", icon:FileText},
    {id: "invoices/new", name:"Create Invoice", icon:Plus},
    {id: "profile", name:"Profile", icon:Users},

];