const Invoice =  require("../models/Invoice");


//Create new invoice
//POST /api/invoices
//private
exports.createInvoice = async(req, res) =>{
    try{
        const user = req.user;
        const{
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
        } = req.body;

        //subtotal calculation
        let subtotal = 0;
        let taxTotal = 0;
        items.forEach((item)=>{
            subtotal += item.unitPrice * item.quantity;
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0))/100;
        });

        const total = subtotal + taxTotal;
        
        const invoice = new Invoice({
            user:req.user.id,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total,
        });

        await invoice.save();
        res.status(201).json(invoice);
     }catch(error){
        res.status(500).json({message:"Error creating invoice", error: error.message});
    }
};

//Get all invoices of logged-in user
//GET/api/invoices
//Private
exports.getInvoices = async(req, res)=>{
    
     try{
        const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");
        res.json(invoices);

    }catch(error){
        res.status(500).json({message:"Error fetching invoice", error: error.message});

    }
};

//Get single invoice by ID
//Get /api/invoices/:id
// Private
exports.getInvoiceById = async(req, res)=>{
     try{
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if(!invoice) return res.status(404).json({message: "Invoice not found"});

        //Check if the invoice belongs to user
        if(invoice.user._id.toString() !== req.user.id){
            return res.status(401).json({message: "Not authorized"});
        }
        res.json(invoice);

    }catch(error){
        res.status(500).json({message:"Error fetching invoice by ID", error: error.message});

    }
};

//Update invoice
//PUT /api/invoices/:id
//Private
exports.updateInvoice = async(req, res)=>{
     try{
        const{
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        } = req.body;


        //recalculate total if items have changed
        let subtotal = 0;
        let taxTotal = 0;
        if(items && items.length>0){
            items.forEach((item)=>{
                subtotal += item.unitPrice * item.quantity;
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0))/100;
            
            });
        }

            const total = subtotal + taxTotal;
           
            //Update Invoice
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                req.params.id,
                {
                    invoiceNumber,
                    invoiceDate,
                    dueDate,
                    billFrom,
                    billTo,
                    items,
                    notes,
                    paymentTerms,
                    status,
                    subtotal,
                    taxTotal,
                    total,
                },
                { new : true }

            );
         if(!updatedInvoice) return res.status(404).json({message: "Invoice not found"});
        res.json(updatedInvoice);
    }catch(error){
        res.status(500).json({message:"Error updating invoice", error: error.message});

    }
};

//Delete Invoice
//DELETE /api/invoices/:id
//Private
exports.deleteInvoice = async(req, res)=>{
     try{
      const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if(!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });

    }catch(error){
        res.status(500).json({message:"Error deleting invoice", error: error.message});

    }
};

