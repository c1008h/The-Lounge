import React from 'react'

interface DropdownMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function DropDownMenu({ onEdit, onDelete }: DropdownMenuProps) {
  return (
    <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={onEdit}>Edit</button>
        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={onDelete}>Delete</button>
    </div>
</div>
  )
}

