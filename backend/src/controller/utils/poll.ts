import { Poll, PollOption } from "@shared/types/db";


const getResults = (poll: Poll) => {
    const { options, results } = poll;
    
    // Group options by total votes across all slots
    const voteGroups = new Map<number, PollOption[]>();
    
    // Calculate total votes for each option and group them
    options.forEach((option) => {
        const totalVotes = Object.values(option.slots).reduce((sum, votes) => sum + votes, 0);
        if (!voteGroups.has(totalVotes)) {
            voteGroups.set(totalVotes, []);
        }
        voteGroups.get(totalVotes)!.push(option);
    });
    
    // Sort vote counts in descending order
    const sortedVoteCounts = Array.from(voteGroups.keys()).sort((a, b) => b - a);
    
    const selectedOptions: PollOption[] = [];
    let remainingCount = results;
    
    // Iterate through groups starting with highest votes
    for (const voteCount of sortedVoteCounts) {
        const groupOptions = voteGroups.get(voteCount)!;
        
        if (groupOptions.length >= remainingCount) {
            // If this group has enough options, take what we need
            selectedOptions.push(...groupOptions.slice(0, remainingCount));
            break;
        } else {
            // Take all options from this group and continue to next
            selectedOptions.push(...groupOptions);
            remainingCount -= groupOptions.length;
        }
        
        if (remainingCount <= 0) break;
    }
    
    return selectedOptions;
};
    