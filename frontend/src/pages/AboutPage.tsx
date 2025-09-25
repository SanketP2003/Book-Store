import { motion } from 'framer-motion';
import { BookOpen, Award, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 mb-12">
        <div className="text-center">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Bookstore
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your premier destination for quality books with a passion for literature
            and a commitment to promoting reading and education.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2010, Bookstore began as a small corner shop with a simple mission: to connect readers with books they'll love. What started as a passion project quickly grew into a beloved community institution.
              </p>
              <p>
                Over the years, we've expanded our collection to include thousands of titles across all genres, from bestselling fiction to academic texts, children's books to classic literature. Our dedication to quality and service has remained unwavering.
              </p>
              <p>
                Today, we're proud to offer an online experience that makes finding your next great read easier than ever, while maintaining the personalized service that has been our hallmark from day one.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="relative h-80 md:h-96"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-primary-100 to-blue-100 rounded-lg transform rotate-2"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[3/4] bg-white rounded shadow-md transform -rotate-3"></div>
                <div className="aspect-[3/4] bg-white rounded shadow-md transform rotate-3"></div>
                <div className="aspect-[3/4] bg-white rounded shadow-md transform rotate-6"></div>
                <div className="aspect-[3/4] bg-white rounded shadow-md transform -rotate-6"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16 py-10 bg-gray-50 rounded-lg px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-2">Knowledge for All</h3>
            <p className="text-gray-600">
              We believe that books and knowledge should be accessible to everyone.
              Our pricing and selection reflect our commitment to making reading
              available to readers of all backgrounds.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Award className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-2">Quality Selection</h3>
            <p className="text-gray-600">
              We carefully curate our inventory to include books that inspire, educate,
              and entertain. Every title is selected with our customers in mind.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Users className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-xl mb-2">Community Focus</h3>
            <p className="text-gray-600">
              Beyond selling books, we aim to foster a community of readers who share
              ideas, recommend titles, and grow together through the power of reading.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/300?img=1' },
            { name: 'David Chen', role: 'Chief Curator', image: 'https://i.pravatar.cc/300?img=3' },
            { name: 'Michelle Rodriguez', role: 'Operations Manager', image: 'https://i.pravatar.cc/300?img=5' },
            { name: 'James Wilson', role: 'Customer Experience', image: 'https://i.pravatar.cc/300?img=7' }
          ].map((member, index) => (
            <motion.div
              key={member.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16 py-10 bg-gray-50 rounded-lg px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: <BookOpen size={32} />, value: '50,000+', label: 'Books in Collection' },
            { icon: <Users size={32} />, value: '10,000+', label: 'Happy Customers' },
            { icon: <Award size={32} />, value: '15+', label: 'Years of Service' },
            { icon: <TrendingUp size={32} />, value: '500+', label: 'New Titles Monthly' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center text-primary-600 mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16 bg-gradient-to-r from-primary-600 to-blue-700 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start reading?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Visit our collection and find your next great read today!
        </p>
        <a href="/books" className="btn bg-white text-primary-700 hover:bg-gray-100 inline-block">
          Explore Our Books
        </a>
      </section>
    </div>
  );
}
