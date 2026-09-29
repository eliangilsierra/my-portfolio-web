import { createMockContactService } from './contact-service';

describe('createMockContactService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the configured latency without delivering anything', async () => {
    vi.useFakeTimers();
    const service = createMockContactService(500);
    const onSettled = vi.fn();

    const sending = service
      .send({ name: 'Ada', email: 'ada@example.com', message: 'Hello there!' })
      .then(onSettled);

    await vi.advanceTimersByTimeAsync(499);
    expect(onSettled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await sending;
    expect(onSettled).toHaveBeenCalledOnce();
  });
});
