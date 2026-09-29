import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render';
import ContactPage from './ContactPage';
import type { ContactService } from './contact-service';

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/^message/i), 'Hello, I would like to talk.');
}

describe('ContactPage', () => {
  it('shows validation errors and does not send an empty form', async () => {
    const service: ContactService = { send: vi.fn() };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage service={service} />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(service.send).not.toHaveBeenCalled();
  });

  it('sends a valid message and confirms it', async () => {
    const service: ContactService = { send: vi.fn().mockResolvedValue(undefined) };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage service={service} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
    expect(service.send).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to talk.',
    });
  });

  it('shows an error and keeps the form when sending fails', async () => {
    const service: ContactService = { send: vi.fn().mockRejectedValue(new Error('network')) };
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWithProviders(<ContactPage service={service} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('Ada Lovelace'));
  });

  it('is upfront that the form is a demo', () => {
    renderWithProviders(<ContactPage />);

    expect(screen.getByText(/demo mode/i)).toBeInTheDocument();
  });

  it('renders in Spanish', () => {
    renderWithProviders(<ContactPage />, { locale: 'es' });

    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });
});
