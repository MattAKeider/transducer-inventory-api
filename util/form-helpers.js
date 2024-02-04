// Create a new transducer object from inputted form data
const createNewTransducer = (formData) => {
  const newTransducer = {
    id: crypto.randomUUID(),
    name: formData.name,
    location: formData.location,
    department: formData.department,
    room: formData.room,
    transducerType: formData.type,
    serialNumber: formData.serial,
    internalIdentifier: formData.internal,
    controlNumber: formData.control,
    dateReceived: new Date(formData.received),
    outOfService: formData.service,
    currentCondition: [
      {
        conditionId: crypto.randomUUID(),
        condition: formData.condition,
        conditionChangedDate: new Date(),
        note: formData.notes,
      },
    ],
  };

  return newTransducer;
};

// Edit a transducer with updated values
const updateTransducer = (formData, originalTransducer) => {
  const updatedTransducer = {
    id: originalTransducer.id,
    name: formData.name,
    location: formData.location,
    department: formData.department,
    room: formData.room,
    transducerType: formData.type,
    serialNumber: formData.serial,
    internalIdentifier: formData.internal,
    controlNumber: formData.control,
    dateReceived: originalTransducer.dateReceived,
    outOfService: formData.service,
    currentCondition: [
      {
        conditionId: crypto.randomUUID(), 
        condition: formData.condition,
        conditionChangedDate: new Date(),
        note: formData.notes,
      }, 
      ...originalTransducer.currentCondition
    ]
  };

  return updatedTransducer;
};

module.exports = {
  createNewTransducer,
  updateTransducer,
};