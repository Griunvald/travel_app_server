# Road Cronicles: Backend Repository

[Road Cronicles](https://www.roadcronicles.com) is a platform where users can log, manage, and share their travel experiences. This repository contains the backend codebase, handling API endpoints, user authentication, database interactions, and cloud integrations.

## Key Features

- **API Layer**: Built with Node.js and Express for modular, RESTful endpoint management.
- **Database Design**: PostgreSQL schema supports relationships between users, trips, entries, and tags, enabling efficient data retrieval and storage.
- **Media Handling**: Integration with AWS S3 for secure and scalable image storage.

## Technical Highlights

- **Framework**: Node.js with Express for scalable backend architecture.
- **Database**: PostgreSQL with direct query optimization (avoiding ORMs for full control).
- **Authentication**: JWT tokens for secure, stateless user sessions.
- **Cloud Infrastructure**:
  - Application layer: Runs API requests and handles user sessions.
  - Database layer: Dedicated PostgreSQL instance with replication and automated backups.
  - Media storage: AWS S3 ensures high availability for user-uploaded content.

## Challenges and Solutions

- **Query Optimization**: Applied indexes and tuned complex queries for performance gains.
- **Scalability**: Designed the backend to support horizontal scaling, separating app logic, database, and media storage.

## Future Improvements

- Implement GraphQL API for more efficient data fetching.
- Add role-based access control for enhanced security in multi-user environments.

Visit the live platform: [www.roadcronicles.com](https://www.roadcronicles.com)
