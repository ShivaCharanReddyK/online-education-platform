# LearnFlow - Educational Program Platform

LearnFlow is a modern, full-stack web application designed to serve as a comprehensive platform for educational program discovery and application management. Built with a cutting-edge tech stack, it provides a seamless experience for prospective students to explore, apply for, and manage their program applications, while offering robust administrative tools for counselors.

The application leverages the power of Next.js with the App Router for a highly performant, server-centric architecture. It features a mock back-end powered by Server Actions, simulating real-world database interactions with an in-memory data store, making it a self-contained and easy-to-run project.

## Key Features

- **Dynamic Program Catalog**: A filterable and searchable list of educational programs with infinite scroll for a smooth browsing experience.
- **AI-Powered Recommendations**: Utilizes **Genkit** to provide personalized program suggestions to applicants based on their background and interests.
- **Student Application System**: A streamlined, multi-step application process with form validation using React Hook Form and Zod.
- **Role-Based Authentication**: Separate user flows and dashboards for 'Student' and 'Counselor' roles.
- **Student Dashboard**: Allows students to track their application status and manage tuition payments for approved programs.
- **Counselor Dashboard**: A dedicated interface for counselors to review, approve, or deny applications, with integrated AI tools to suggest alternative programs for denied applicants.
- **Simulated Email Notifications**: Server actions simulate sending email confirmations for application submission and status updates.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google AI
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **State Management**: React Context API (for authentication)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project with the following:
    ```
    # MongoDB Database
    MONGODB_URI=your_mongodb_connection_string
    
    # NextAuth Configuration
    NEXTAUTH_SECRET=your-secret-key
    NEXTAUTH_URL=http://localhost:9002
    
    # Gmail Email Service
    GMAIL_USER=your-gmail@gmail.com
    GMAIL_APP_PASSWORD=your-app-password
    
    # AI Features (optional)
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    
    For Gmail App Password:
    - Go to your Google Account → Security
    - Enable 2-Step Verification
    - Create an App Password for "Mail" and device "Other"
    - Copy the 16-character password provided

4.  **Run the Genkit development server:**
    In a separate terminal, start the Genkit development UI, which allows you to inspect and test your AI flows.
    ```sh
    npm run genkit:dev
    ```
    This will typically run on `http://localhost:4000`.

5.  **Run the Next.js development server:**
    In your main terminal, start the Next.js application.
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Architectural Overview

-   **`src/app`**: Contains all routes, pages, and layouts, following the Next.js App Router paradigm.
-   **`src/components`**: Home to all reusable React components, organized by feature (e.g., `programs`, `shared`, `ui`).
-   **`src/actions`**: Server Actions that serve as the back-end logic, handling data fetching, mutations, and business rules. This is where the mock database is managed.
-   **`src/ai/flows`**: Genkit flows that encapsulate logic for interacting with generative AI models.
-   **`src/lib`**: Utility functions, constants, and type definitions.
-   **`src/contexts`**: React Context providers, such as the `AuthContext` for managing user sessions.
