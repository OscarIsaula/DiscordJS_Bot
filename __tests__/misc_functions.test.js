import MiscFunctions from './misc_functions.js';
import moment from 'moment';
import { it, expect, describe, createSpy } from 'vitest';

const miscFunctions = new MiscFunctions();
const mockMessage = {
  content: '',
  channel: {
    send: createSpy(),
  },
};

describe('MiscFunctions', () => {
  it('djTime should calculate the time correctly', () => {
    const now = moment.utc('2023-07-13T00:00:00');
    const originalMoment = moment;
    moment.utc = () => now;
    mockMessage.content = '!dj';
    miscFunctions.djTime(mockMessage);
    const expectedDuration = moment.duration(moment('2023-07-13T03:15:00').diff(now));

    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      expect.stringContaining(`going to be online in ${expectedDuration.hours()}h ${expectedDuration.minutes()}m ${expectedDuration.seconds()}.${expectedDuration.milliseconds()}s`)
    );

    moment.utc = originalMoment;
    expect(mockMessage.channel.send).toHaveBeenCalledWith(expect.stringContaining('DJ_SweatLord'));
  });

  it('coinFlip should send a message indicating heads or tails', () => {
    mockMessage.content = '!flip';
    miscFunctions.coinFlip(mockMessage);
    expect(mockMessage.channel.send).toHaveBeenCalledWith(expect.stringMatching(/Heads\/Yes|Tails\/No/));
  });

  it('diceRoll should send a message with a random dice roll result', () => {
    mockMessage.content = '!diceroll 6';
    miscFunctions.diceRoll(mockMessage, 6);
    expect(mockMessage.channel.send).toHaveBeenCalledWith(expect.stringMatching(/^\d+$/));
  });

  it('diceRoll should handle invalid input gracefully', () => {
    mockMessage.content = '!diceroll invalid';
    miscFunctions.diceRoll(mockMessage, 'invalid');
    expect(mockMessage.channel.send).toHaveBeenCalledWith(expect.stringContaining('Invalid input'));
  });
});
