# RentPe - Property Rental Management Platform

RentPe is a comprehensive property rental management platform designed to streamline the rental process for property owners, managers, and tenants. The platform provides an intuitive interface for managing properties, tracking rentals, processing payments, and facilitating communication between all stakeholders.

## Features

### For Property Owners & Managers
- **Property Management**: List and manage multiple properties with detailed information
- **Tenant Management**: Track tenant information, lease agreements, and rental history
- **Payment Processing**: Automated rent collection and payment tracking
- **Maintenance Requests**: Streamlined maintenance request management
- **Financial Reporting**: Comprehensive reports on income, expenses, and occupancy rates

### For Tenants
- **Property Search**: Browse available rental properties with advanced filters
- **Online Applications**: Submit rental applications digitally
- **Payment Portal**: Secure online rent payment processing
- **Maintenance Requests**: Easily submit and track maintenance requests
- **Communication Hub**: Direct messaging with property managers

## Technology Stack

This project is built with modern web technologies to ensure scalability, performance, and maintainability:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: React Query for server state management
- **Backend**: Supabase for database, authentication, and real-time features
- **Maps Integration**: Mapbox GL for property location visualization
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rentpe-v1.git
   cd rentpe-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure your Supabase credentials and other environment variables in the `.env` file.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
rentpe-v1/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
├── supabase/          # Supabase migrations and functions
└── docs/              # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact our team at support@rentpe.com or create an issue in the GitHub repository. 
