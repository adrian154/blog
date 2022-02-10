Here are all the steps in crafting a successful hypothesis test.

## Define the quantity you are testing

State whether you are testing &mu; (mean) or &pi; (proportion/probability).

## State hypotheses

State the null and alternative hypotheses (H<sub>0</sub> and H<sub>a</sub>, respectively) in terms of the quantity you are testing.

## State significance level

Identify the significance value, i.e. the value of &alpha;. 

## Check assumptions about the sample

This is virtually identical to the process used in confidence intervals.
* Ensure that the sample is a simple random sample (SRS).
* If you are running a test on &pi;, make sure that *n*&times;&pi; &GreaterEqual; 10 and *n*&times;(1-&pi;) &GreaterEqual; 10.
* Assess the normality of the data.
    * If *n* > 30, the [central limit theorem](https://en.wikipedia.org/wiki/Central_limit_theorem) applies, so the sampling distribution should be normally distributed. 
    * Otherwise, create a box plot of the data to check for skewness. If the data is not too skewed, state that the data appears to be normally distributed and proceed.
    * Sometimes, the datapoints are not provided; instead, you are given the mean and standard deviation of the sampling distribution. In this situation, you have no choice but to assume that the data is normally distributed.
* Make sure that *n* is less than 10% of the population.

## Do the math

Fundamentally, the point of a hypothesis test is to calculate the probability of observing the result that we observed *if* the null hypothesis is true, and compare that value to the chosen significance level. The calculated probability represents the chance of making a type I error, concluding that H<sub>0</sub> is untrue when it's actually true, so a smaller value is "better" since it means we are less likely to be wrong. How to go about this depends on what type of hypothesis test you are running.

If you are comparing a sample proportion to a population proportion, it is possible to characterize the sampling distribution of the population precisely. We have already established that the sampling distribution is normal; the mean &mu; is also given, and standard deviation `$\sigma$` can be found using the formula `$\sigma = \sqrt{\frac{\pi(1-\pi)}{n}}$`. The next steps are fairly simple: determine the *z*-score representing the experiment's outcome using `$\frac{p - \pi}{\sigma}$`, and calculate the likelihood of the outcome using normalCDF.

If you are testing a sample mean, the process is different since the population standard deviation is generally not known in this situation. **Coming soon**: *t*-tests.

## Draw a conclusion

The significance level &alpha; determines what probability is sufficient to reject H<sub>0</sub>. If the probability value is below &alpha;, H<sub>0</sub> can be rejected. Otherwise you "failed to reject" H<sub>0</sub>.

If H<sub>0</sub> could not be rejected, **do not say "evidence suggests"** or any variant thereof! The fact that you were unable to reject the null hypothesis implies that the evidence did not really suggest anything. Instead, state that there "isn't enough evidence" to conclude that H<sub>a</sub> is true.

## Identify the type I and type II errors

You may be asked to explain the meaning of a type I and type II error in the context of the hypothesis test you just performed. Remember these definitions:
* A **type I error** is rejecting H<sub>0</sub> and concluding that H<sub>a</sub> is true when it's actually false.
* A **type II error** is failing to reject H<sub>0</sub> and concluding that H<sub>a</sub> is false when it's actually true.

# Example

Let's say we picked a random sample of Mission students and tested how many know the identity sin(2*x*) = 2sin(*x*)cos(*x*). We found that 72 out of 177 students knew the identity. Our theory is that more Mission students know the identity than the mean, which is 38%.

* Let &pi; equal the true proportion of MSJHS students that know the identity.
* H<sub>0</sub> is that &pi; = 0.38, and H<sub>a</sub> is that &pi; > 0.38
* Let &alpha; = 0.05.
* State the formula that we will be using (critical *z*-score, standard deviation)
* Check the assumptions about our sample.
    * The sample is an SRS.
    * Check category sizes.
        * 177 &times; 0.38 = 67.3 &GreaterEqual; 10
        * 177 &times; (1 - 0.38) = 109.7 &GreaterEqual; 10
    * *n* is less than 10% of the population (there are about 2,000 students at Mission)
    * All the assumptions were met, so we can proceed with our hypothesis test.
* Perform our calculations.
    * Calculate the *z*-score (*z* &asymp; 0.734)
    * Find the area to the right of the curve (A &asymp; 0.2314)
* Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is not enough evidence to conclude that more than 38% of MSJHS students know the identity.
* **Type I Error**: Concluding that >38% of MSJHS students know the identity when only 38% know it.
* **Type II Error**: Concluding that 38% of MSJHS students know the identity when in reality >38% know it.