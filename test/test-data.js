const NEW_TRANSDUCER_FORM = {
  name: "TW-23",
  location: "CROCKER",
  department: "MFM",
  room: "201",
  type: "TV",
  serial: "Z1236600",
  internal: "41",
  control: "00FB-12346",
  received: "2024-01-22",
  notes: "New from GE",
  service: false,
  condition: "New"
};

const TRANSDUCERS = [
  {
    id: '809693f3-844a-4d46-904b-0552d6eb9345',
    name: 'C1-5',
    location: 'MIDTOWN',
    department: 'MFM',
    transducerType: 'TA',
    room: '1',
    serialNumber: 'K1302KR5',
    internalIdentifier: '1',
    controlNumber: '00FB-12345',
    dateReceived: '2023-01-22T00:00:00.000Z',
    outOfService: true,
    currentCondition: [
      {
        conditionId: '37642e95-d9ba-4f5d-a9ee-d2e53fbe659f',
        condition: 'Broken (Out of Service)',
        conditionChangedDate: '2023-11-17T00:00:00.000Z',
        note: 'Broke now',
      },
      {
        conditionId: 'd0aa7cba-5934-45c4-889b-5f1b77632374',
        condition: 'Refurbished',
        conditionChangedDate: '2023-04-02T00:00:00.000Z',
        note: 'Refurbished item',
      },
      {
        conditionId: 'a3d562c5-39d1-438d-a4e5-3ae7838045b2',
        condition: 'Working',
        conditionChangedDate: '2023-01-22T00:00:00.000Z',
        note: 'New from GE',
      }
    ],
  },
  {
    id: '7846c4de-e8a2-4dff-bdb8-775c501c9179',
    name: 'D1-4',
    location: 'CMC',
    department: 'MFM',
    transducerType: 'TV',
    room: '2',
    serialNumber: 'F123300',
    internalIdentifier: '7',
    controlNumber: '00FB-12346',
    dateReceived: '2023-03-22T00:00:00.000Z',
    outOfService: false,
    currentCondition: [
      {
        conditionId: 'bea1a8a7-6092-4909-b20f-9653f9e22c6d',
        condition: 'Working',
        conditionChangedDate: '2023-03-22T00:00:00.000Z',
        note: 'New from GE',
      },
    ],
  },
  {
    id: '703efa2b-2b9f-4099-855d-e6561d27d320',
    name: 'F23-45',
    location: 'MIDTOWN',
    department: 'IVF',
    transducerType: 'TA',
    room: 'IVF-A',
    serialNumber: 'K1377777',
    internalIdentifier: '21',
    controlNumber: '00SD-34444',
    dateReceived: '2021-05-02T00:00:00.000Z',
    outOfService: true,
    currentCondition: [
      {
        conditionId: 'fe2654b1-426f-49a9-af54-f23c207c5f3d',
        condition: 'Broken (Out of Service)',
        conditionChangedDate: '2023-10-17T00:00:00.000Z',
        note: 'New from GE',
      },
    ],
  },
  {
    id: '99d44e35-d8bf-4af3-a768-4e802bb22a06',
    name: 'Z1-4',
    location: 'CROCKER',
    department: 'IVF',
    transducerType: 'TA',
    room: '3',
    serialNumber: 'K1302KR0',
    internalIdentifier: '3',
    controlNumber: '00WB-12045',
    dateReceived: '2023-01-22T00:00:00.000Z',
    outOfService: true,
    currentCondition: [
      {
        conditionId: '27bcfc1b-9aaf-411b-9ca7-2ab4d0064e8e',
        condition: 'Broken (Out of Service)',
        conditionChangedDate: '2023-11-20T00:00:00.000Z',
        note: 'New from GE',
      },
    ],
  },
  {
    id: '75a32749-f5b3-44c6-a1df-d550bb43b178',
    name: 'C1-1',
    location: 'RISMAN',
    department: 'MFM',
    transducerType: 'TV',
    room: '4',
    serialNumber: 'K1302Z34',
    internalIdentifier: '14',
    controlNumber: '00FB-13221',
    dateReceived: '2020-03-15T00:00:00.000Z',
    outOfService: false,
    currentCondition: [
      {
        conditionId: 'be003c0e-9f2d-4ccb-aab6-e04ed95e625c',
        condition: 'Working',
        conditionChangedDate: '2020-03-15T00:00:00.000',
        note: 'New from GE',
      },
    ],
  },
];

module.exports = {
  NEW_TRANSDUCER_FORM,
  TRANSDUCERS,
};