import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render';
import { ContactPage } from './ContactPage';
import type { ContactService } from '@/services/contact/contact-service';

type User = ReturnType<typeof userEvent.setup>;

async function fillValidForm(user: User) {
  await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/^message/i), 'Hello, I would like to talk.');
}

const submit = (user: User) => user.click(screen.getByRole('button', { name: /send message/i }));

describe('ContactPage', () => {
  it('shows validation errors, focuses the first invalid field and sends nothing', async () => {
    const contactService: ContactService = { send: vi.fn() };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />, { contactService });

    await submit(user);

    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name/i)).toHaveAttribute('aria-invalid', 'true');
    await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveFocus());
    expect(contactService.send).not.toHaveBeenCalled();
  });

  it('keeps valid input while other fields are being corrected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />, { contactService: { send: vi.fn() } });

    await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace');
    await submit(user);

    await screen.findByText(/invalid email address/i);
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Ada Lovelace');
  });

  it('sends a valid message, confirms it and can start over', async () => {
    const contactService: ContactService = { send: vi.fn().mockResolvedValue(undefined) };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />, { contactService });

    await fillValidForm(user);
    await submit(user);

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
    expect(contactService.send).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to talk.',
    });

    await user.click(screen.getByRole('button', { name: /send another message/i }));

    expect(screen.getByLabelText(/^name/i)).toHaveValue('');
  });

  it('shows an error and keeps the input when delivery fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const contactService: ContactService = {
      send: vi.fn().mockRejectedValue(new Error('network')),
    };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />, { contactService });

    await fillValidForm(user);
    await submit(user);

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Ada Lovelace');
  });

  it('disables the button while a message is being sent', async () => {
    let finish: () => void = () => undefined;
    const contactService: ContactService = {
      send: () => new Promise<void>((resolve) => (finish = resolve)),
    };
    const user = userEvent.setup();
    renderWithProviders(<ContactPage />, { contactService });

    await fillValidForm(user);
    await submit(user);

    expect(await screen.findByRole('button', { name: /sending/i })).toBeDisabled();
    finish();
    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
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
