import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/mockData";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">RentPe Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, guides, and insights to make your renting experience better
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all group">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-6">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-display font-semibold text-foreground mt-3 mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
                        </div>
                        <span className="text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
