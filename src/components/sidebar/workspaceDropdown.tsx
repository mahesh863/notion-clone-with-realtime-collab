'use client';
import { useAppState } from '@/lib/providers/state-provider';
import { workspace } from '@/lib/superbase/superbase.types';
import React, { useEffect, useState } from 'react';
import SelectedWorkspace from './selectedWorkspace';
import CustomDialogTrigger from '../global/custom-dialog-trigger';

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  sharedWorkspaces,
  collaboratingWorkspaces,
  defaultValue,
}) => {
  const { dispatch, state } = useAppState();
  const [selectedOptions, setSelectedOptions] = useState(defaultValue);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: 'SET_WORKSPACES',
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces]);

  const handleSelect = (option: workspace) => {
    setSelectedOptions(option);
    setIsOpen(false);
  };

  return (
    <div className='relative inline-block text-left'>
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOptions ? (
            <SelectedWorkspace workspace={selectedOptions} />
          ) : (
            'Select a workspace'
          )}
        </span>
      </div>
      {isOpen && (
        <div
          className='origin-top-right absolute  w-full rounded-md shadow-md z-50 h-[190px]
        bg-black/10
        backdrop-blur-lg
        group
        overflow-scroll
        border-[1px]
        border-muted
        '
        >
          <div className='rounded-md flex flex-col'>
            <div className='!p-2'>
              {!!privateWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>Private</p>
                  <hr />
                  {privateWorkspaces.map((options) => (
                    <SelectedWorkspace
                      key={options.id}
                      workspace={options}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!sharedWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>Shared</p>
                  <hr />
                  {sharedWorkspaces.map((options) => (
                    <SelectedWorkspace
                      key={options.id}
                      workspace={options}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}

              {!!collaboratingWorkspaces.length && (
                <>
                  <p className='text-muted-foreground'>Collaborating</p>
                  <hr />
                  {collaboratingWorkspaces.map((options) => (
                    <SelectedWorkspace
                      key={options.id}
                      workspace={options}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
            </div>
            <CustomDialogTrigger
              header='Create a workspace'
              content={<WorkspaceCreator />}
              description='Create a workspace to organize your files and folders, it gives you the power to collaborate with your friends and family.'
            >
              <></>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
