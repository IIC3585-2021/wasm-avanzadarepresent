// oriignal code from http://www.martinbroadhurst.com/traveling-salesman-problem-using-backtracking-in-c.html
// adapted to suit our needs

#include <stdlib.h>
#include <string.h>
#include <stdio.h>

static void swap(uint32_t *a, uint32_t *b)
{
  uint32_t temp = *a;
  *a = *b;
  *b = temp;
}

static void traveling_salesman_recursive(uint32_t **adjmat, uint32_t order,
                                         uint32_t *best_tour, uint32_t *best_tour_cost, uint32_t *partial_tour,
                                         uint32_t *partial_tour_cost, uint32_t level)
{
  if (level == order - 1)
  {
    /* Add last two edges to complete the tour */
    uint32_t tour_cost = *partial_tour_cost + adjmat[partial_tour[order - 2]][partial_tour[order - 1]] + adjmat[partial_tour[order - 1]][0];
    if (*best_tour_cost == 0 || tour_cost < *best_tour_cost)
    {
      /* Best tour so far */
      memcpy(best_tour, partial_tour, order * sizeof(uint32_t));
      *best_tour_cost = tour_cost;
    }
  }
  else
  {
    uint32_t i;
    for (i = level; i < order; i++)
    {
      if (*best_tour_cost == 0 || *partial_tour_cost + adjmat[partial_tour[level - 1]][partial_tour[i]] < *best_tour_cost)
      {
        /* Next permutation */
        swap(&partial_tour[level], &partial_tour[i]);
        uint32_t cost = adjmat[partial_tour[level - 1]][partial_tour[level]];
        *partial_tour_cost += cost;
        traveling_salesman_recursive(adjmat, order, best_tour, best_tour_cost,
                                     partial_tour, partial_tour_cost, level + 1);
        *partial_tour_cost -= cost;
        swap(&partial_tour[level], &partial_tour[i]);
      }
    }
  }
}

uint32_t traveling_salesman(uint32_t **adjmat, uint32_t order,
                            uint32_t **best_tour)
{
  uint32_t i;
  uint32_t best_tour_cost = 0;
  uint32_t partial_tour_cost = 0;
  uint32_t *partial_tour = malloc(order * sizeof(uint32_t));
  *best_tour = malloc(order * sizeof(uint32_t));
  if (partial_tour == NULL || *best_tour == NULL)
  {
    free(partial_tour);
    free(*best_tour);
    *best_tour = NULL;
    return 0;
  }
  for (i = 0; i < order; i++)
  {
    partial_tour[i] = i;
  }
  traveling_salesman_recursive(adjmat, order, *best_tour, &best_tour_cost, partial_tour,
                               &partial_tour_cost, 1);
  free(partial_tour);
  return best_tour_cost;
}

uint32_t *solve_tsp(uint32_t **adjmat, uint32_t order)
{
  uint32_t *best_tour;
  uint32_t cost = traveling_salesman(adjmat, order, &best_tour);
  uint32_t i;
  printf("Best tour cost: %u\n", cost);
  printf("Vertices:\n");
  for (i = 0; i < order; i++)
  {
    printf("%u ", best_tour[i]);
  }

  printf("\nEdge weights:\n");
  for (i = 0; i < order - 1; i++)
  {
    printf("%u ", adjmat[best_tour[i]][best_tour[i + 1]]);
  }
  printf("%u\n", adjmat[best_tour[order - 1]][0]);
  return best_tour;
  // free(best_tour);
}

// int main(void)
// {
//   uint32_t r1[] = {0, 3, 3};
//   uint32_t r2[] = {1, 0, 2};
//   uint32_t r3[] = {1, 2, 0};

//   uint32_t order = 3; /* Vertices */
//   uint32_t *adjmat[] = {r1, r2, r3};
//   solve_tsp(adjmat, order);
//   return 0;
// }
