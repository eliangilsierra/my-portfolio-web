import { dictionaries } from '@/i18n/dictionaries';
import { createContactSchema } from './contact-schema';
import type { ContactService } from '@/services/contact/contact-service';
import { INITIAL_CONTACT_STATE } from './contact-state';
import { createContactAction } from './submit-contact';

const schema = createContactSchema(dictionaries.en.contact.validation);

function form(values: Record<string, string | File>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const validValues = {
  name: '  Ada Lovelace ',
  email: 'ada@example.com',
  message: 'Hello, I would like to talk.',
};

describe('createContactAction', () => {
  it('reports every invalid field and keeps what the visitor typed', async () => {
    const service: ContactService = { send: vi.fn() };
    const action = createContactAction(service, schema);

    const state = await action(
      INITIAL_CONTACT_STATE,
      form({ name: 'A', email: 'nope', message: '' }),
    );

    expect(state.status).toBe('invalid');
    expect(state.errors).toEqual({
      name: 'Name must be at least 2 characters',
      email: 'Invalid email address',
      message: 'Message must be at least 10 characters',
    });
    expect(state.values).toEqual({ name: 'A', email: 'nope', message: '' });
    expect(service.send).not.toHaveBeenCalled();
  });

  it('sends trimmed data and clears the form on success', async () => {
    const service: ContactService = { send: vi.fn().mockResolvedValue(undefined) };
    const action = createContactAction(service, schema);

    const state = await action(INITIAL_CONTACT_STATE, form(validValues));

    expect(service.send).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to talk.',
    });
    expect(state).toEqual({
      status: 'sent',
      values: { name: '', email: '', message: '' },
      errors: {},
    });
  });

  it('reports a failure, logs it and keeps the input when delivery throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const service: ContactService = { send: vi.fn().mockRejectedValue(new Error('network')) };
    const action = createContactAction(service, schema);

    const state = await action(INITIAL_CONTACT_STATE, form(validValues));

    expect(state.status).toBe('failed');
    expect(state.values.name).toBe('  Ada Lovelace ');
    expect(consoleError).toHaveBeenCalled();
  });

  it('treats non-text entries as empty', async () => {
    const action = createContactAction({ send: vi.fn() }, schema);
    const upload = new File(['x'], 'x.txt');

    const state = await action(INITIAL_CONTACT_STATE, form({ ...validValues, name: upload }));

    expect(state.status).toBe('invalid');
    expect(state.values.name).toBe('');
  });

  it('uses the messages of the schema it was given', async () => {
    const spanish = createContactSchema(dictionaries.es.contact.validation);
    const action = createContactAction({ send: vi.fn() }, spanish);

    const state = await action(INITIAL_CONTACT_STATE, form({ name: '', email: '', message: '' }));

    expect(state.errors.email).toBe('Correo electrónico no válido');
  });
});
