'use client';
import React from 'react';
import { User } from '../../lib/superbase/superbase.types';

const WorkspaceCreator = () => {
  const [permissions, setPermissions] = useState('private');
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [user, setuser] = useState(second);

  return <div>WorkspaceCreator</div>;
};

export default WorkspaceCreator;
