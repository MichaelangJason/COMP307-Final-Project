import { MeetingAvailability, Participant, Poll } from "@shared/types/db";


export const getResults = (poll: Poll) => {
    const { options, results } = poll;
    const voteGroups = new Map<number, { date: string, slot: string}[]>();
    
    // group options by votes
    options.forEach((option) => {
      Object.entries(option.slots).forEach(([slot, votes]) => {
        if (!voteGroups.has(votes)) {
            voteGroups.set(votes, []);
        }
        voteGroups.get(votes)!.push({ date: option.date, slot });
      });
    });
    
    // sort vote counts in descending order
    const sortedVoteCounts = Array.from(voteGroups.keys()).sort((a, b) => b - a);
    
    const selectedOptions: { date: string, slot: string }[] = [];
    let remainingCount = results;

    // iterate through groups with highest votes
    for (const voteCount of sortedVoteCounts) {
        const groupOptions = voteGroups.get(voteCount)!;

        if (groupOptions.length <= remainingCount) {
            selectedOptions.push(...groupOptions);
            remainingCount -= groupOptions.length;
        } else {
            selectedOptions.push(...groupOptions.slice(0, remainingCount));
            break;
        }

        if (remainingCount <= 0) break;
    }

    selectedOptions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return selectedOptions;
};

export const prepareAvailabilities = (selectedOptions: { date: string, slot: string }[]) => {
  const availabilities: MeetingAvailability[] = [];
  const dateGroup = new Map<string, string[]>();

  selectedOptions.forEach((option) => {
    if (!dateGroup.has(option.date)) {
      dateGroup.set(option.date, []);
    }
    dateGroup.get(option.date)!.push(option.slot);
  });

  dateGroup.forEach((slots, date) => {
    availabilities.push({
      date,
      slots: slots.reduce((acc, slot) => {
        acc[slot] = [];
        return acc;
      }, {} as Record<string, Participant[]>),
      max: 0
    });
  });
  availabilities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return availabilities;
}
    