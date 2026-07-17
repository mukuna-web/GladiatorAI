# Reviewer training guide

The reviewer decides whether a toy result is internally consistent, not whether a real agent is better.

1. Confirm the evidence count meets the displayed threshold.
2. Check the correct formula for the mode: debate and coding use a rounded category mean; trivia uses the rounded correct-answer percentage.
3. Remember that debate rhetoric is not semantically scored and code is not executed.
4. Check that the winner/draw follows the three-point margin.
5. Approve only a coherent synthetic result; otherwise flag a correction.

Use a stable reviewer name. Never infer real-person competence from a persona result. Recalibrate by independently reviewing ten synthetic battles after scoring-rule changes. Stop the demo if slot swapping changes a persona's score, repeat runs change deterministic judge output, or an abstained battle can reach the leaderboard.
