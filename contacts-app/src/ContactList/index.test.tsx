import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ContactList } from 'ContactList';

global.fetch = jest.fn();

describe('ContactList Component', () => {
    const contacts = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987654321', address: '456 Elm St' }
    ];

    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    test('fetches and displays contacts', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => contacts,
        });

        render(<ContactList />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();            
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/contacts');
    });    
});
