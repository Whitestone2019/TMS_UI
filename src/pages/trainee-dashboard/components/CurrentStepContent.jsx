import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SecureContentWrapper from '../../../components/ui/SecureContentWrapper';

const CurrentStepContent = ({ 
  currentStep = 1,
  traineeInfo = { name: 'John Doe', id: 'TRN001' },
  onStepComplete,
  className = '' 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const stepContent = {
    1: {
      title: 'Introduction to Programming',
      duration: '45 minutes',
      content: `Welcome to the fundamentals of programming! This comprehensive module will introduce you to the core concepts that form the foundation of all programming languages.

Programming is the process of creating instructions for computers to execute. These instructions, written in various programming languages, tell the computer exactly what to do and how to do it.

Key Concepts Covered:
• What is programming and why it matters
• Understanding algorithms and logic
• Basic programming terminology
• Problem-solving approaches
• Introduction to different programming paradigms

Learning Objectives:
By the end of this module, you will understand:
1. The fundamental concepts of programming
2. How computers process instructions
3. Basic problem-solving techniques
4. The importance of logical thinking in programming

Practical Applications:
Throughout this module, you'll see real-world examples of how programming concepts apply to everyday technology, from mobile apps to web browsers to smart home devices.Remember: Programming is not just about writing code—it's about thinking logically and solving problems systematically.`,
      resources: [
        { name: 'Programming Fundamentals Guide', type: 'PDF', size: '2.4 MB' },
        { name: 'Introduction Video Series', type: 'Video', duration: '30 min' },
        { name: 'Practice Exercises', type: 'Interactive', items: '15 exercises' }
      ]
    },
    2: {
      title: 'Data Structures',
      duration: '60 minutes',
      content: `Data structures are fundamental building blocks in programming that allow us to organize, store, and manipulate data efficiently.

Understanding data structures is crucial for writing efficient programs and solving complex problems. Different data structures are optimized for different types of operations.

Core Data Structures:
• Arrays: Ordered collections of elements
• Objects: Key-value pairs for structured data
• Lists: Dynamic collections that can grow and shrink
• Stacks: Last-in-first-out (LIFO) data structure
• Queues: First-in-first-out (FIFO) data structure

When to Use Each Structure:
Arrays are perfect when you need indexed access to elements. Objects work well for representing real-world entities with properties. Lists are ideal when the size of your data changes frequently.

Performance Considerations:
Different operations have different time complexities depending on the data structure used. Understanding these trade-offs helps you choose the right structure for your specific needs.

Real-World Examples:
• Shopping cart items (Array/List)
• User profile information (Object)
• Browser history (Stack)
• Print queue (Queue)`,
      resources: [
        { name: 'Data Structures Handbook', type: 'PDF', size: '3.1 MB' },
        { name: 'Interactive Visualizations', type: 'Interactive', items: '8 demos' },
        { name: 'Coding Challenges', type: 'Practice', items: '20 problems' }
      ]
    }
  };

  const currentContent = stepContent?.[currentStep] || stepContent?.[1];

  const handleCompleteStep = async () => {
    setIsCompleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onStepComplete) {
      onStepComplete(currentStep);
    }
    
    setIsCompleting(false);
  };

  const handleSessionExpired = () => {
    // Handle session expiry
    console.log('Session expired - redirecting to login');
  };

  return (
    // <SecureContentWrapper
    //   watermarkText={`${traineeInfo?.name} - ${traineeInfo?.id} - CONFIDENTIAL TRAINING MATERIAL`}
    //   sessionTimeout={30}
    //   onSessionExpired={handleSessionExpired}
    //   className={className}
    // >
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Content Header */}
        <div className="bg-primary/5 border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{currentContent?.title}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Icon name="Clock" size={14} className="mr-1" />
                    {currentContent?.duration}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Icon name="User" size={14} className="mr-1" />
                    Step {currentStep}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                In Progress
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Main Content */}
          <div className="prose max-w-none mb-8">
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {currentContent?.content}
            </div>
          </div>

          {/* Resources Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="FileText" size={20} className="mr-2" />
              Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {currentContent?.resources?.map((resource, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon 
                        name={
                          resource?.type === 'PDF' ? 'FileText' :
                          resource?.type === 'Video' ? 'Play' :
                          resource?.type === 'Interactive'? 'Monitor' : 'Book'
                        } 
                        size={18} 
                        className="text-primary" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm mb-1">{resource?.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {resource?.size || resource?.duration || `${resource?.items}`}
                      </p>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="xs"
                          iconName="ExternalLink"
                          iconPosition="right"
                          iconSize={12}
                          className="text-xs"
                        >
                          Access
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Actions */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  iconName="BookmarkPlus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Bookmark
                </Button>
                <Button
                  variant="outline"
                  iconName="MessageSquare"
                  iconPosition="left"
                  iconSize={16}
                >
                  Ask Question
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="ChevronLeft"
                  iconPosition="left"
                  iconSize={16}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="default"
                  iconName="CheckCircle"
                  iconPosition="left"
                  iconSize={16}
                  loading={isCompleting}
                  onClick={handleCompleteStep}
                >
                  {isCompleting ? 'Completing...' : 'Mark as Complete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </SecureContentWrapper>
  );
};

export default CurrentStepContent;