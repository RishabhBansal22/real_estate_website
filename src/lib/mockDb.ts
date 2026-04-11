import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'mock_users.json');
const PROPS_FILE = path.join(process.cwd(), 'mock_properties.json');

// Original Seed Data
export const DUMMY_PROPERTIES = [
  { id: "1", title: "Premium Smart Farm Land", price: 1250000, location: "River Valley Road, Countryside", beds: 0, baths: 0, sqft: 50000, imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800", type: "Land", createdAt: "2024-03-20T10:00:00Z" },
  { id: "2", title: "Eco-Friendly Smart Villa", price: 2400000, location: "Green Tech Park, Suburbs", beds: 4, baths: 3, sqft: 3200, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", type: "Villa", createdAt: "2024-03-15T10:00:00Z" },
  { id: "3", title: "Lush Agricultural Plot", price: 850000, location: "Highland Greens District", beds: 0, baths: 0, sqft: 25000, imageUrl: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&q=80&w=800", type: "Land", createdAt: "2024-03-18T10:00:00Z" },
  { id: "4", title: "Riverfront Plot", price: 950000, location: "River Valley Road, Countryside", beds: 0, baths: 0, sqft: 30000, imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800", type: "Land", createdAt: "2024-02-28T10:00:00Z" },
  { id: "5", title: "Modern Smart Home", price: 1500000, location: "Eco Tech Park", beds: 3, baths: 2, sqft: 2200, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", type: "House", createdAt: "2024-03-25T10:00:00Z" },
  { id: "6", title: "Commercial Orchard Land", price: 3200000, location: "Highland Greens District", beds: 0, baths: 0, sqft: 100000, imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800", type: "Commercial", createdAt: "2024-01-15T10:00:00Z" },
  { id: "7", title: "Green Tech Valley Estate", price: 4000000, location: "Green Tech Park, Suburbs", beds: 6, baths: 5, sqft: 7500, imageUrl: "https://images.unsplash.com/photo-1600607687931-cebf143de805?auto=format&fit=crop&q=80&w=800", type: "Villa", createdAt: "2024-03-01T10:00:00Z" },
  { id: "8", title: "Suburban Farmhouse", price: 1800000, location: "Riverside Estates", beds: 4, baths: 4, sqft: 4000, imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800", type: "House", createdAt: "2024-03-10T10:00:00Z" }
];

// Initialize users DB
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
} else {
  // Promote the first user (Test User) to Admin for development
  let users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  if (users.length > 0 && users[0].email === "test@example.com" && users[0].role !== "admin") {
    users[0].role = "admin";
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

// Initialize properties DB
if (!fs.existsSync(PROPS_FILE)) {
  fs.writeFileSync(PROPS_FILE, JSON.stringify(DUMMY_PROPERTIES, null, 2));
}

// User Helpers
export const getMockUsers = () => {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); } catch { return []; }
};

export const saveMockUser = (user: any) => {
  const users = getMockUsers();
  users.push({ ...user, savedProperties: user.savedProperties || [] });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export const toggleMockUserSavedProperty = (userId: string, propertyId: string) => {
  let users = getMockUsers();
  const idx = users.findIndex((u: any) => u._id === userId);
  
  if (idx !== -1) {
    if (!users[idx].savedProperties) {
      users[idx].savedProperties = [];
    }
    
    const propIdx = users[idx].savedProperties.indexOf(propertyId);
    if (propIdx === -1) {
      users[idx].savedProperties.push(propertyId); // Add
    } else {
      users[idx].savedProperties.splice(propIdx, 1); // Remove
    }
    
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
};

// Properties Helpers
export const getMockProperties = () => {
  try { return JSON.parse(fs.readFileSync(PROPS_FILE, 'utf-8')); } catch { return []; }
};

export const saveMockProperties = (props: any) => {
  fs.writeFileSync(PROPS_FILE, JSON.stringify(props, null, 2));
};

export const addMockProperty = (prop: any) => {
  const props = getMockProperties();
  props.unshift(prop); // Add to front
  saveMockProperties(props);
};

export const updateMockProperty = (id: string, updatedProp: any) => {
  let props = getMockProperties();
  const idx = props.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    props[idx] = { ...props[idx], ...updatedProp };
    saveMockProperties(props);
  }
};

export const deleteMockProperty = (id: string) => {
  let props = getMockProperties();
  props = props.filter((p: any) => p.id !== id);
  saveMockProperties(props);
};
