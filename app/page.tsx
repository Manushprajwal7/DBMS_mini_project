import Link from "next/link"
import { ArrowRight, BarChart3, Filter, IndianRupee, LayoutDashboard, ListFilter, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Student Budget Tracker</h1>
          <p className="text-xl mb-8">Track, manage, and analyze your expenses with ease</p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<LayoutDashboard className="h-10 w-10" />}
              title="Intuitive Dashboard"
              description="Get a complete overview of your expenses with our easy-to-use dashboard."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10" />}
              title="Visual Analytics"
              description="Visualize your spending patterns with interactive charts and graphs."
            />
            <FeatureCard
              icon={<IndianRupee className="h-10 w-10" />}
              title="Expense Tracking"
              description="Track every rupee you spend with detailed categorization."
            />
            <FeatureCard
              icon={<Filter className="h-10 w-10" />}
              title="Advanced Filtering"
              description="Filter expenses by date, category, and amount to find what you need."
            />
            <FeatureCard
              icon={<ListFilter className="h-10 w-10" />}
              title="Custom Sorting"
              description="Sort your expenses in various ways to gain better insights."
            />
            <FeatureCard
              icon={<Upload className="h-10 w-10" />}
              title="Export Data"
              description="Export your expense data to CSV for further analysis or record-keeping."
            />
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start tracking your expenses today and make informed financial decisions.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Student Budget Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm border">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

