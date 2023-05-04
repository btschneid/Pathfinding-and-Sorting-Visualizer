# Pathfinding Visualization

This project is a web application for visualizing various pathfinding algorithms such as Breadth First Search, Depth First Search, A Star, Dijkstra, and Greedy Best First Search. It allows users to select a start and end tile, add walls to the tile map, and visualize how the pathfinding algorithms find the shortest path from start to end. Users can also create random mazes using depth first search backtracking and set random tilemaps with varying ratios of walls to open tiles.

## How to use
Follow the link: https://btschneid.github.io/Pathfinder/

1. Select a start tile by clicking on a tile and then selecting the green button in the tile button container.
2. Select an end tile by clicking on a tile and then selecting the red button in the tile button container.
3. Add walls to the tile map by clicking on the tiles.
4. Click on an algorithm of choice to visualize the pathfinding process.
5. Once the visualization is complete, click and drag either the start or end node to visualize how the pathfinding algorithm works from other areas.
6. Create a random maze using depth first search backtracking by clicking on the "Create Maze" button.
7. Set random tilemaps with differing ratios of walls to open tiles using the range slider

## Algorithms

### Breadth First Search (BFS)

BFS is a graph traversal algorithm that explores all the vertices of a graph in breadth-first order. It starts at the root node and explores all the nodes at the current depth before moving on to nodes at the next depth. This algorithm is guaranteed to find the shortest path if it exists, but it can be slow and memory-intensive for large graphs.

* Time complexity: O(V+E), where V is the number of vertices and E is the number of edges
* Space complexity: O(V), where V is the number of vertices

### Depth First Search (DFS)

DFS is another graph traversal algorithm that explores all the vertices of a graph, but in depth-first order. It starts at the root node and explores as far as possible along each branch before backtracking. Unlike BFS, DFS is not guaranteed to find the shortest path, but it can be faster and use less memory than BFS for certain graphs.

* Time complexity: O(V+E), where V is the number of vertices and E is the number of edges
* Space complexity: O(V), where V is the number of vertices

### Dijkstra

Dijkstra is a shortest path algorithm that finds the shortest path from a start node to all other nodes in a weighted graph. It works by assigning tentative distances to all nodes and then iteratively selecting the node with the smallest tentative distance and updating the distances of its neighbors. Dijkstra's algorithm is guaranteed to find the shortest path if all edge weights are non-negative, but it can be slow and memory-intensive for large graphs.

* Time complexity: O((V+E) log V), where V is the number of vertices and E is the number of edges
* Space complexity: O(V), where V is the number of vertices

### A Star

A Star is a heuristic search algorithm that finds the shortest path from a start node to an end node in a weighted graph. It works by using a heuristic function to estimate the distance from each node to the end node and combining this with the actual distance from the start node to calculate a priority for each node. A Star uses a priority queue to select the next node to explore and updates the distances of its neighbors based on the priority. A Star with a Euclidean heuristic function uses the straight-line distance between nodes as the estimate, while A Star with a Manhattan heuristic function uses the sum of the absolute differences in x and y coordinates.

* Time complexity: O(E log V), where V is the number of vertices and E is the number of edges
* Space complexity: O(V), where V is the number of vertices

### Greedy Best First Search

Greedy Best First Search is a heuristic search algorithm that prioritizes exploring nodes that are closest to the end node in a weighted graph. It works by using a heuristic function to estimate the distance from each node to the end node and selecting the node with the smallest estimate as the next node to explore. Greedy Best First Search can be faster than A Star, but it is not guaranteed to find the shortest path and may get stuck in local optima.

* Time complexity: O(E log V), where V is the number of vertices and E is the number of edges
* Space complexity: O(V), where V is the number of vertices
