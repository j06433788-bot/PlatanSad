import React from 'react';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  // Placeholder blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Як доглядати за туєю взимку',
      excerpt: 'Корисні поради по догляду за туєю в зимовий період. Захист від морозів та правильний полив.',
      date: '15 січня 2025',
      author: 'PlatanSad',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Формування бонсай: основні правила',
      excerpt: 'Детальний гайд по формуванню дерев бонсай. Техніки обрізки та підтримання форми.',
      date: '10 січня 2025',
      author: 'PlatanSad',
      image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Топ-5 хвойних рослин для саду',
      excerpt: 'Підбірка найкращих хвойних рослин для українського клімату.',
      date: '5 січня 2025',
      author: 'PlatanSad',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Адаптовано */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center" data-testid="blog-title">
            Блог
          </h1>
          <p className="text-sm md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Корисні статті та поради по догляду за рослинами
          </p>
        </div>
      </div>

      {/* Main Content - Оптимізовано для мобільних */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-lg md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
              data-testid="blog-post-card"
            >
              {/* Image */}
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Meta */}
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-green-600 font-medium group-hover:gap-3 transition-all text-sm md:text-base">
                  <span>Читати далі</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon Message - Оптимізовано */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-6 md:p-12 text-center">
          <div className="bg-green-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Більше статей незабаром</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-5 md:mb-8">
            Ми регулярно публікуємо нові статті про догляд за рослинами, поради по садівництву та новинки нашого асортименту.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base">
            Підписатися на новини
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;