import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const GroupsContext = createContext();

// Create a provider component
export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load groups data from JSON file
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        // Import the groups.json file
        const groupsData = require('../groups.json');
        
        // Process data if needed and add default values for missing fields
        const processedData = groupsData.map(group => ({
          ...group,
          description: group.description || "",
          photo: group.photo || null,
          color: group.color || getRandomColor()
        }));
        
        setGroups(processedData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading groups data: ", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadGroups();
  }, []);

  // Generate a random color for groups without one
  const getRandomColor = () => {
    const colors = [
      '#4ea4a6', // teal
      '#6a7de8', // blue
      '#e87d7d', // red
      '#e8c77d', // yellow
      '#a67de8', // purple
      '#7de88f', // green
      '#e87dcc'  // pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Add a new group
  const addGroup = (newGroup) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  // Remove a group
  const removeGroup = (groupId) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
  };

  // Update a group's information
  const updateGroup = (groupId, updatedInfo) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, ...updatedInfo } : group
      )
    );
  };

  // Get all groups
  const getAllGroups = () => {
    return groups;
  };

  // Get a specific group by ID
  const getGroupById = (groupId) => {
    return groups.find(group => group.id === groupId);
  };

  // Find a group by name
  const findGroupByName = (groupName) => {
    return groups.find(group => 
      group.name.toLowerCase() === groupName.toLowerCase()
    );
  };

  // Add a member to a group
  const addMemberToGroup = (groupId, userId) => {
    const group = getGroupById(groupId);
    if (group) {
      // If members array doesn't exist, create it
      const members = group.members || [];
      // Add member if not already in the group
      if (!members.includes(userId)) {
        updateGroup(groupId, { members: [...members, userId] });
      }
    }
  };

  // Remove a member from a group
  const removeMemberFromGroup = (groupId, userId) => {
    const group = getGroupById(groupId);
    if (group && group.members) {
      updateGroup(groupId, { 
        members: group.members.filter(memberId => memberId !== userId) 
      });
    }
  };

  // Context value
  const value = {
    groups,
    loading,
    error,
    addGroup,
    removeGroup,
    updateGroup,
    getAllGroups,
    getGroupById,
    findGroupByName,
    addMemberToGroup,
    removeMemberFromGroup,
    getRandomColor
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
};