class EmailQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.maxRetries = 3;
        this.retryDelay = 5000; //5 seconds
    }

    async add(emailData, priority = 'normal') {
        const job = {
            id: Date.now() + Math.random(),
            data: emailData,
            priority,
            retries: 0,
            createdAt: new Date(),
            createdAt: new Date(),
            status: 'queued'
        }
        // Add to queue based on priority

        if (priority === 'high') {
            this.queue.unshift(job);
        }
        else if (priority === 'low') {
            this.queue.push(job);
        } else {
            // Normal priority - insert in middle
            const midIndex = Math.floor(this.queue.length / 2);
            this.queue.splice(midIndex, 0, job);
        }
        console.log(`📧 Email queued (${priority}): ${emailData.to} - ${emailData.subject}`);
        // Start processing if not already

        if (!this.processing) {
            this.process();
        }

        return job.id;

    }

    /**
  * Process queue
  */
    async process() {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;
        const emailProvider = require('./email.provider');

        while (this.queue.length > 0) {
            const job = this.queue.shift();

            try {
                console.log(`📧 Processing email ${job.id} to: ${job.data.to}`);

                const result = await emailProvider.send(job.data);
                job.status = 'sent';
                job.sentAt = new Date();

                console.log(`✅ Email ${job.id} sent successfully`);

            } catch (error) {
                job.retries++;
                job.lastError = error.message;

                console.error(`❌ Email ${job.id} failed (${job.retries}/${this.maxRetries}):`, error.message);

                if (job.retries < this.maxRetries) {
                    // Re-queue with delay
                    setTimeout(() => {
                        this.queue.unshift(job);
                        console.log(`🔄 Email ${job.id} re-queued for retry ${job.retries}`);
                    }, this.retryDelay * job.retries);

                    job.status = 'retry';
                } else {
                    job.status = 'failed';
                    console.error(`💀 Email ${job.id} permanently failed after ${this.maxRetries} retries`);
                }
            }

            // Delay between emails to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.processing = false;
    }

    /**
     * Get queue stats
     */
    getStats() {
        return {
            queued: this.queue.filter(j => j.status === 'queued').length,
            processing: this.processing,
            total: this.queue.length,
            jobs: this.queue.map(j => ({
                id: j.id,
                to: j.data.to,
                subject: j.data.subject,
                priority: j.priority,
                status: j.status,
                retries: j.retries
            }))
        };
    }

    /**
     * Clear queue
     */
    async clear() {
        this.queue = [];
        console.log(' Email queue cleared');
    }

    /**
     * Get queue length
     */
    getLength() {
        return this.queue.length;
    }
}
module.exports = new EmailQueue();
