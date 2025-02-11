const Address = require('../models/Address'); // Assurez-vous d'importer votre modèle Address

// Créer une nouvelle adresse
const createAddress = async (req, res) => {
  const { userId, address, state, city, postalCode, country, status } = req.body;

  try {
    const newAddress = await Address.create({ userId, address, state, city, postalCode, country, status });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la création de l\'adresse' });
  }
};

// Obtenir toutes les adresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des adresses' });
  }
};

// Obtenir une adresse par ID
const getAddressById = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findAll({where:{userId:id}});
    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ message: 'Adresse non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération de l\'adresse' });
  }
};

// Mettre à jour une adresse
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { userId, address, state, city, postalCode, country, status } = req.body;

  try {
    const updatedAddress = await Address.update(
      { userId, address, state, city, postalCode, country, status },
      { where: { id } }
    );

    if (updatedAddress[0] === 0) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }
    res.status(200).json({ message: 'Adresse mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour de l\'adresse' });
  }
};

// Supprimer une adresse
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.destroy({ where: { id } });

    if (deletedAddress === 0) {
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }
    res.status(200).json({ message: 'Adresse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression de l\'adresse' });
  }
};
// Mettre à jour le statut d'une adresse pour un utilisateur spécifique
const updateAddressStatus = async (req, res) => {
    const { id } = req.params;  // ID de l'adresse à mettre à jour
    const { userId, status } = req.body;  // userId et status à mettre à jour
  
    try {
      // Vérifier si l'adresse appartient à l'utilisateur spécifié
      const address = await Address.findOne({ where: { id, userId } });
  
      if (!address) {
        return res.status(404).json({ message: 'Adresse non trouvée pour cet utilisateur' });
      }
  
      // Si l'utilisateur veut marquer cette adresse comme choisie (status = true),
      // on doit d'abord mettre le statut de l'autre adresse à false
      if (status === true) {
        // Trouver une autre adresse de cet utilisateur avec le statut `true`
        const existingSelectedAddress = await Address.findOne({
          where: { userId, status: true }
        });
  
        // Si une autre adresse est déjà marquée comme sélectionnée,
        // mettre son statut à false avant de modifier la nouvelle adresse
        if (existingSelectedAddress) {
          existingSelectedAddress.status = false;
          await existingSelectedAddress.save();
        }
      }
  
      // Mettre à jour le statut de l'adresse choisie
      address.status = status;
  
      // Sauvegarder les modifications de l'adresse choisie
      await address.save();
  
      res.status(200).json({ message: 'Statut de l\'adresse mis à jour avec succès', address });
    } catch (error) {
      res.status(500).json({ error: 'Échec de la mise à jour du statut de l\'adresse' });
    }
  };
  
  // Obtenir une adresse où le statut est true pour un userId spécifique
const getAddressByStatusTrueAndUserId = async (req, res) => {
    const { userId } = req.params;  // Récupérer userId à partir des paramètres
  
    try {
      // Recherche de l'adresse avec le statut true et le userId spécifié
      const address = await Address.findOne({ where: { status: true, userId: userId } });
  
      if (address) {
        res.status(200).json(address);
      } else {
        res.status(404).json({ message: `Aucune adresse avec statut true trouvée pour l'utilisateur ${userId}` });
      }
    } catch (error) {
      res.status(500).json({ error: 'Échec de la récupération de l\'adresse' });
    }
  };
  
  
module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  updateAddressStatus,
  getAddressByStatusTrueAndUserId,
};
