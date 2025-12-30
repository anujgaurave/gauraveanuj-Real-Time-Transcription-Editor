import numpy as np

class AudioBuffer:
    def __init__(self, sample_rate=16000, max_seconds=15):
        self.sample_rate = sample_rate
        self.max_samples = sample_rate * max_seconds
        self.buffer = np.zeros(0, dtype=np.int16)
        self.total_samples = 0  

    def add(self, pcm16: bytes):
        samples = np.frombuffer(pcm16, dtype=np.int16)
        self.total_samples += len(samples)

        self.buffer = np.concatenate([self.buffer, samples])

        if len(self.buffer) > self.max_samples:
            self.buffer = self.buffer[-self.max_samples:]

    def get_audio(self):
        return self.buffer.copy()

    def current_time(self):
        return self.total_samples / self.sample_rate
