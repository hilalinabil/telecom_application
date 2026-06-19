git # Fiber Optic Network Management System

## Overview

The Fiber Optic Network Management System is a web-based platform designed to manage, monitor, and visualize fiber optic infrastructure.

The system centralizes information related to:

* Datacenters
* Distribution Nodes (OLT / Répartiteurs)
* Splitters
* Client Distribution Boxes
* Fiber Links
* Network Topology
* Technical Operations
* User Management

The objective of the platform is to provide telecom operators and technical teams with a complete view of the network infrastructure while simplifying administration, maintenance, and monitoring activities.

---

# Business Context

Modern fiber optic networks contain thousands of interconnected components distributed across large geographical areas.

Managing these infrastructures manually leads to:

* Inconsistent documentation
* Data redundancy
* Difficulty locating equipment
* Slow incident response
* Poor visibility of network topology

This application solves these challenges by providing a centralized management platform.

---

# Main Objectives

The platform aims to:

* Centralize infrastructure information
* Manage network assets
* Visualize fiber topology
* Track equipment utilization
* Simplify maintenance operations
* Improve decision-making
* Secure access to sensitive information

---

# Network Architecture

The network follows the following hierarchy:

Datacenter
↓
OLT / Répartiteur
↓
Splitter
↓
Client Box
↓
Customer

## Datacenter

Represents the central infrastructure node.

Responsibilities:

* Host core equipment
* Distribute connectivity
* Feed distribution nodes
* Monitor network capacity

---

## OLT / Répartiteur

Represents a distribution point connected to a datacenter.

Responsibilities:

* Receive optical signals
* Manage fiber ports
* Feed splitters
* Control capacity allocation

---

## Splitter

Passive optical component used to split a fiber signal.

Examples:

* 1:8
* 1:16
* 1:32

Responsibilities:

* Signal distribution
* Connection branching
* Capacity management

---

## Client Box

Represents the last distribution point before customer access.

Responsibilities:

* Client connection management
* Port allocation
* Capacity tracking

---

## Fiber Path

Represents the physical connection between infrastructure elements.

Responsibilities:

* Track routes
* Store GPS coordinates
* Monitor operational status
* Measure cable utilization

---

# System Actors

## Super Administrator

Highest authority level.

Responsibilities:

* Create administrators
* Manage platform settings
* Access all resources
* Perform audits

---

## Administrator

Operational management role.

Responsibilities:

* Create technicians
* Manage users
* Manage infrastructure
* Generate reports
* Monitor network status

---

## Technician

Field operation role.

Responsibilities:

* View infrastructure
* Update equipment status
* Report incidents
* Manage maintenance operations

---

# Authentication & Authorization

## Security Model

The application uses Role-Based Access Control (RBAC).

Roles:

* SUPER_ADMIN
* ADMIN
* TECHNICIAN

Role hierarchy:

SUPER_ADMIN > ADMIN > TECHNICIAN

---

## Registration Policy

The application does NOT provide public registration.

User creation is performed exclusively by authorized administrators.

Workflow:

SUPER_ADMIN
→ creates ADMIN

ADMIN
→ creates TECHNICIAN

TECHNICIAN
→ Login only

---

## Authentication

Users authenticate using:

* Matricule
* Password

Example:

TECH-0001
Password123

---

## Authorization

Access is protected through:

* Spring Security
* JWT Authentication
* Role Verification

Every request is validated before accessing protected resources.

---

# Audit System

Every user action is traceable.

User records include:

* CreatedBy
* CreatedAt
* UpdatedAt

This ensures accountability and security.

---

# Core Features

## User Management

Features:

* Create users
* Update users
* Disable users
* Manage roles
* Search users

---

## Datacenter Management

Features:

* Create datacenter
* Update datacenter
* Delete datacenter
* Monitor capacity

---

## OLT Management

Features:

* Register OLT
* Monitor ports
* Capacity tracking
* Link management

---

## Splitter Management

Features:

* Create splitters
* Monitor utilization
* Track available outputs

---

## Client Box Management

Features:

* Register client boxes
* Monitor available ports
* Track utilization

---

## Fiber Path Management

Features:

* Create paths
* Update paths
* Delete paths
* Track cable status
* GPS visualization

---

## Geographic Visualization

The application provides an interactive map using:

* OpenStreetMap
* Leaflet

Capabilities:

* Display infrastructure nodes
* Display fiber routes
* Geographic search
* Route visualization

---

# Dashboard

The dashboard provides:

## Network Statistics

* Total datacenters
* Total OLTs
* Total splitters
* Total client boxes

## Capacity Metrics

* Used ports
* Available ports
* Occupancy rates

## Operational Metrics

* Active links
* Maintenance links
* Failed links

---

# Technology Stack

## Frontend

* ReactJS
* React Router
* Axios
* Leaflet
* OpenStreetMap

---

## Backend

* Spring Boot 3
* Spring Security
* JWT
* Maven
* Lombok
* Validation API

---

## Database

* MongoDB

---

# Backend Architecture

The backend follows a layered architecture.

Presentation Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

MongoDB

This architecture ensures:

* Separation of concerns
* Maintainability
* Scalability
* Testability

---

# Project Structure

src/

├── auth/

├── users/

├── datacenters/

├── repartiteurs/

├── splitters/

├── clientboxes/

├── fibrepaths/

├── dashboard/

├── security/

├── config/

├── exception/

└── common/

---

# Security Features

Implemented security measures:

* JWT Authentication
* Password Hashing (BCrypt)
* Role-Based Authorization
* Request Validation
* Input Sanitization
* Audit Logging

---

# Future Improvements

Potential future developments:

* Real-time monitoring
* GIS integration
* Network simulation
* Incident management
* Maintenance scheduling
* Notification system
* Predictive analytics
* AI-assisted fault detection

---

# Development Roadmap

## Phase 1

Infrastructure Setup

* Spring Boot
* MongoDB
* Security Configuration

---

## Phase 2

Authentication System

* JWT
* RBAC
* User Management

---

## Phase 3

Network Asset Management

* Datacenters
* OLTs
* Splitters
* Client Boxes

---

## Phase 4

Fiber Path Management

* Route Modeling
* GPS Integration

---

## Phase 5

Map Visualization

* Leaflet
* OpenStreetMap

---

## Phase 6

Dashboard & Reporting

* KPIs
* Statistics
* Reports

---

# Conclusion

The Fiber Optic Network Management System is designed as a secure, scalable, and centralized platform for managing telecom fiber infrastructures. By combining modern web technologies, geographic visualization, and robust security mechanisms, the platform enables efficient network administration, infrastructure monitoring, and operational decision-making.
