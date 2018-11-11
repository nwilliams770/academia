from enum import Enum


class Operation(Enum):
    """Operations"""

    DELETED = 1
    INSERTED = 2
    SUBSTITUTED = 3

    def __str__(self):
        return str(self.name.lower())


def distances(a, b):
    """Calculate edit distance from a to b"""
    cost = [[(0, None) for x in range(len(b) + 1)] for y in range(len(a) + 1)]
    #first rows
    for i in range(1, len(a) + 1):
        cost[i][0] = (i, Operation.DELETED)

    for j in range(1, len(b) + 1):
        cost[0][j] = (i, Operation.INSERTED)

    for i in range(1, len(a) + 1):
        for j in range (1, len(b) + 1):
            delete_cost, _ = cost[i - 1][j]
            insert_cost, _ = cost[i][j - 1]
            sub_cost, _ = cost[i - 1][j - 1]

            delete_cost += 1
            insert_cost += 1

            if a[i - 1] != b[j - 1]:
                sub_cost += 1

            if delete_cost <= insert_cost and delete_cost <= sub_cost:
                cost[i][j] = (delete_cost, Operation.DELETED)
            elif insert_cost <= delete_cost and insert_cost <= sub_cost:
                cost[i][j] = (insert_cost, Operation.INSERTED)
            else:
                cost[i][j] = (sub_cost, Operation.SUBSTITUTED)
    return cost
    # return [[]]