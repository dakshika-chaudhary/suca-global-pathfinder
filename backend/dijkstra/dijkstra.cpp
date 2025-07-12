
#include <bits/stdc++.h>
using namespace std;

unordered_map<string, int> nodeNameToId;
vector<string> nodeIdToName;

string toLower(const string& s) {
    string result = s;
    transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}

struct Edge {
    int from, to, weight;
    bool safe, shaded, accessible;
    string traffic;
};

vector<Edge> edgeList;

vector<int> shortestPath(int n, int source, int dest, const vector<Edge>& edges) {
    vector<vector<pair<int, int>>> adj(n + 1);

    for (const Edge& e : edges) {
        int penalty = 0;
        if (!e.safe) penalty += 100;
        if (!e.accessible) penalty += 100;
        if (e.traffic == "high") penalty += 100;
        else if (e.traffic == "medium") penalty += 50;

        int totalWeight = e.weight + penalty;
        adj[e.from].push_back({e.to, totalWeight});
        adj[e.to].push_back({e.from, totalWeight});
    }

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    vector<int> dist(n + 1, INT_MAX);
    vector<int> parent(n + 1);
    iota(parent.begin(), parent.end(), 0); // parent[i] = i

    dist[source] = 0;
    pq.push({0, source});

  while (!pq.empty()) {
    auto top = pq.top(); pq.pop();
    int dis = top.first;
    int node = top.second;

    for (auto& pair : adj[node]) {
        int adjNode = pair.first;
        int edgeWeight = pair.second;
            if (dis + edgeWeight < dist[adjNode]) {
                dist[adjNode] = dis + edgeWeight;
                pq.push({dist[adjNode], adjNode});
                parent[adjNode] = node;
            }
        }
    }

    if (dist[dest] == INT_MAX) return {-1};

    vector<int> path;
    for (int node = dest; parent[node] != node; node = parent[node])
        path.push_back(node);
    path.push_back(source);
    reverse(path.begin(), path.end());
    return path;
}

int main() {
    int m;
    string sourceName, destName;

    cin >> m;
    cin.ignore();
    getline(cin, sourceName);
    getline(cin, destName);
    sourceName = toLower(sourceName);
    destName = toLower(destName);

    int idCounter = 1;
    nodeIdToName.resize(1000);

    for (int i = 0; i < m; ++i) {
        string line;
        getline(cin >> ws, line);
        stringstream ss(line);

        string from, to, traffic;
        int weight, safe, shaded, accessible;

        ss >> from >> to >> weight >> safe >> shaded >> accessible >> traffic;

        string normFrom = toLower(from);
        string normTo = toLower(to);

        if (nodeNameToId.find(normFrom) == nodeNameToId.end()) {
            nodeNameToId[normFrom] = idCounter;
            nodeIdToName[idCounter] = from;
            idCounter++;
        }

        if (nodeNameToId.find(normTo) == nodeNameToId.end()) {
            nodeNameToId[normTo] = idCounter;
            nodeIdToName[idCounter] = to;
            idCounter++;
        }

        edgeList.push_back({
            nodeNameToId[normFrom],
            nodeNameToId[normTo],
            weight,
            (bool)safe,
            (bool)shaded,
            (bool)accessible,
            traffic
        });
    }

    if (nodeNameToId.find(sourceName) == nodeNameToId.end() || nodeNameToId.find(destName) == nodeNameToId.end()) {
        cout << "Source or Destination not found.\n";
        cout << "PATH: Not reachable\n";
        cout << "COST: -1\n";
        return 0;
    }

    int n = idCounter - 1;
    int source = nodeNameToId[sourceName];
    int dest = nodeNameToId[destName];

    vector<int> path = shortestPath(n, source, dest, edgeList);

    cout << "Source: " << nodeIdToName[source] << "\n";
    cout << "Destination: " << nodeIdToName[dest] << "\n";

    cout << "ROUTE:\n";
    for (const auto& entry : nodeNameToId) {
        cout << " - " << entry.first << " -> ID " << entry.second << "\n";
    }

    if (path[0] == -1) {
        cout << "PATH: Not reachable\n";
        cout << "COST: -1\n";
    } else {
        cout << "PATH: ";
        for (int i = 0; i < path.size(); i++) {
            cout << nodeIdToName[path[i]];
            if (i != path.size() - 1) cout << " -> ";
        }
        cout << "\n";

        int totalCost = 0;
        for (int i = 1; i < path.size(); i++) {
            int u = path[i - 1], v = path[i];
            for (const Edge& e : edgeList) {
                if ((e.from == u && e.to == v) || (e.from == v && e.to == u)) {
                    totalCost += e.weight;
                    break;
                }
            }
        }
        cout << "COST: " << totalCost << "\n";
    }

    return 0;
}
