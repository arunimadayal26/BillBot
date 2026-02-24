import {Link} from "react-router-dom";
import{Twitter, Github, Linkedin, FileText} from "lucide-react"

{/*Footer Link Component*/}
const FooterLink = ({ href, to, children})=>{
    const className = "block text-gray-400 hover:text-white transition-colors duration-200";
    if(to){
        return <Link to={to} className={className}>{children}</Link>;
    }
    return <a href = {href} className={className}>{childName}</a>;
};

{/*Social Link Component*/}
const SocialLink = ({href, children})=>{
    return(
        <a
        href={href}
        className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
        target = "_blank"
        rel="noopener noreferrer"
        >
        {children}
        </a>
    );
};

const Footer =()=> {
  return (
   <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-2 lg:col-span-1">
                <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-blue-950 rounded-md flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">BillBot - AI Invoice Generator</span>
                </Link>
                <p className="text-base font-semibold mb-4">Simple. Quick. Efficient</p>
                </div>
            </div>
           
            {/* Bottom row: copyright and social links */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ">
                <p className="text-gray-400">
                    &copy; 2026 BillBot. All rights reserved.
                </p>
            
            <div className="flex space-x-4">
                <SocialLink href="#">
                    <Twitter className="w-5 h-5" />
                </SocialLink>
                <SocialLink href="#">
                    <Github className="w-5 h-5" />
                </SocialLink>
                <SocialLink href="#">
                    <Linkedin className="w-5 h-5" />
                </SocialLink>
                </div>
                </div>
               </div>
               </footer>
  );
};

export default Footer;
