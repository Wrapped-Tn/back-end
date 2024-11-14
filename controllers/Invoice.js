const Invoice = require('../models/Invoice.js');

// Créer une facture
const createInvoice = async (req, res) => {
  const { seller_id, amount, date, status } = req.body;

  try {
    const newInvoice = await Invoice.create({ seller_id, amount, date, status });
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// Récupérer une facture par ID
const getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByPk(id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
};

// Récupérer toutes les factures
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve invoices' });
  }
};

// Mettre à jour une facture
const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { amount, date, status } = req.body;

  try {
    const invoice = await Invoice.findByPk(id);
    if (invoice) {
      invoice.amount = amount || invoice.amount;
      invoice.date = date || invoice.date;
      invoice.status = status || invoice.status;
      await invoice.save();
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

// Supprimer une facture
const deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByPk(id);
    if (invoice) {
      await invoice.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
};
